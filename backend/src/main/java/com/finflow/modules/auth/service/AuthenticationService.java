package com.finflow.modules.auth.service;

import com.finflow.modules.auth.domain.*;
import com.finflow.modules.auth.dto.AuthenticationResult;
import com.finflow.modules.auth.dto.LoginRequest;
import com.finflow.modules.auth.dto.RefreshTokenResponse;
import com.finflow.modules.auth.repository.LoginHistoryRepository;
import com.finflow.modules.auth.repository.UserCredentialRepository;
import com.finflow.modules.auth.repository.UserRepository;
import com.finflow.modules.auth.validator.LoginValidator;
import com.finflow.shared.config.JwtTokenProvider;
import com.finflow.shared.constants.ErrorCodes;
import com.finflow.shared.exception.BusinessRuleException;
import com.finflow.shared.exception.UnauthorizedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AuthenticationService {

    private static final Logger log = LoggerFactory.getLogger(AuthenticationService.class);

    static final int LOCKOUT_THRESHOLD_MINOR = 5;
    static final int LOCKOUT_THRESHOLD_MAJOR = 10;

    private static final String DUMMY_HASH =
            "$argon2id$v=19$m=65536,t=3,p=1$c29tZXNhbHQ$RdescudvJCsgt3ub+b+dHWJf1M8AKiSzRfu00ZZmOYc";

    private final UserRepository userRepository;
    private final UserCredentialRepository credentialRepository;
    private final LoginHistoryRepository loginHistoryRepository;
    private final LoginValidator validator;
    private final PasswordEncoder passwordEncoder;
    private final ApplicationEventPublisher eventPublisher;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenService refreshTokenService;

    public AuthenticationService(UserRepository userRepository,
                                 UserCredentialRepository credentialRepository,
                                 LoginHistoryRepository loginHistoryRepository,
                                 LoginValidator validator,
                                 PasswordEncoder passwordEncoder,
                                 ApplicationEventPublisher eventPublisher,
                                 JwtTokenProvider jwtTokenProvider,
                                 RefreshTokenService refreshTokenService) {
        this.userRepository = userRepository;
        this.credentialRepository = credentialRepository;
        this.loginHistoryRepository = loginHistoryRepository;
        this.validator = validator;
        this.passwordEncoder = passwordEncoder;
        this.eventPublisher = eventPublisher;
        this.jwtTokenProvider = jwtTokenProvider;
        this.refreshTokenService = refreshTokenService;
    }

    @Transactional
    public AuthenticationResult authenticate(LoginRequest request, String ipAddress, String userAgent) {
        User user = authenticateAndReturnUser(request, ipAddress, userAgent);
        List<String> roles = loadUserRoleNames(user);

        String accessToken = jwtTokenProvider.generateAccessToken(
                user.getId().toString(), user.getEmail(), roles, List.of());

        return new AuthenticationResult(
                accessToken, user.getId(), user.getEmail(), user.getUsername(),
                user.getStatus().name(), roles, LocalDateTime.now(), user.getLastLoginAt());
    }

    @Transactional
    public RefreshTokenResponse authenticateWithRefresh(LoginRequest request, String ipAddress, String userAgent) {
        User user = authenticateAndReturnUser(request, ipAddress, userAgent);
        List<String> roles = loadUserRoleNames(user);

        String accessToken = jwtTokenProvider.generateAccessToken(
                user.getId().toString(), user.getEmail(), roles, List.of());

        String refreshToken = refreshTokenService.createRefreshToken(user, ipAddress, userAgent);

        return RefreshTokenResponse.of(accessToken, refreshToken, 900);
    }

    private User authenticateAndReturnUser(LoginRequest request, String ipAddress, String userAgent) {
        validator.validate(request);

        LoginRequest normalized = request.normalize();
        String identifier = normalized.identifier();
        String password = normalized.password();

        log.debug("Authentication attempt for identifier={}", identifier);

        Optional<User> userOpt = resolveUser(identifier);

        if (userOpt.isEmpty()) {
            passwordEncoder.matches(password, DUMMY_HASH);
            log.info("Authentication failed: user not found, identifier={}", identifier);
            recordAttempt(null, identifier, false, LoginHistory.FailureReason.INVALID_CREDENTIALS,
                    ipAddress, userAgent);
            throw UnauthorizedException.invalidCredentials();
        }

        User user = userOpt.get();

        if (Boolean.TRUE.equals(user.getIsDeleted())) {
            passwordEncoder.matches(password, DUMMY_HASH);
            log.warn("Authentication attempt for deleted user: id={}", user.getId());
            recordAttempt(user, identifier, false, LoginHistory.FailureReason.INVALID_CREDENTIALS,
                    ipAddress, userAgent);
            throw UnauthorizedException.invalidCredentials();
        }

        LoginHistory.FailureReason statusFailure = checkAccountStatus(user);
        if (statusFailure != null) {
            passwordEncoder.matches(password, DUMMY_HASH);
            log.info("Authentication rejected: user={}, reason={}", user.getId(), statusFailure);
            recordAttempt(user, identifier, false, statusFailure, ipAddress, userAgent);
            throw UnauthorizedException.invalidCredentials();
        }

        if (user.isLocked()) {
            passwordEncoder.matches(password, DUMMY_HASH);
            log.warn("Authentication rejected: account locked, user={}, lockedUntil={}",
                    user.getId(), user.getLockedUntil());
            recordAttempt(user, identifier, false, LoginHistory.FailureReason.ACCOUNT_LOCKED,
                    ipAddress, userAgent);
            throw new BusinessRuleException(ErrorCodes.ACCOUNT_LOCKED,
                    "Account is locked due to too many failed login attempts. "
                            + "Please try again later or contact support.");
        }

        UserCredential credential = credentialRepository
                .findByUserAndCredentialTypeAndIsActiveTrueAndIsDeletedFalse(user, CredentialType.PASSWORD)
                .orElse(null);

        if (credential == null || !passwordEncoder.matches(password, credential.getHashedValue())) {
            user.recordFailedLogin();
            userRepository.save(user);

            log.info("Authentication failed: invalid password, user={}, failedAttempts={}",
                    user.getId(), user.getFailedLoginCount());

            if (user.isLocked()) {
                recordAttempt(user, identifier, false, LoginHistory.FailureReason.ACCOUNT_LOCKED,
                        ipAddress, userAgent);
                throw new BusinessRuleException(ErrorCodes.ACCOUNT_LOCKED,
                        "Account is locked due to too many failed login attempts. "
                                + "Please try again later or contact support.");
            }

            recordAttempt(user, identifier, false, LoginHistory.FailureReason.INVALID_CREDENTIALS,
                    ipAddress, userAgent);
            throw UnauthorizedException.invalidCredentials();
        }

        // Success
        user.recordLogin();
        userRepository.save(user);

        credential.recordUsage();
        credentialRepository.save(credential);

        recordAttempt(user, identifier, true, null, ipAddress, userAgent);

        log.info("Authentication successful: user={}, email={}", user.getId(), user.getEmail());

        eventPublisher.publishEvent(new UserLoggedInEvent(
                user.getId().toString(), user.getEmail(), user.getUsername(),
                LocalDateTime.now(), ipAddress));

        return user;
    }

    private Optional<User> resolveUser(String identifier) {
        if (identifier.contains("@")) {
            return userRepository.findByEmailIgnoreCaseAndIsDeletedFalse(identifier);
        }
        return userRepository.findByUsernameIgnoreCaseAndIsDeletedFalse(identifier);
    }

    private LoginHistory.FailureReason checkAccountStatus(User user) {
        return switch (user.getStatus()) {
            case SUSPENDED -> LoginHistory.FailureReason.ACCOUNT_SUSPENDED;
            case CLOSED -> LoginHistory.FailureReason.ACCOUNT_CLOSED;
            case ACTIVE -> null;
        };
    }

    private List<String> loadUserRoleNames(User user) {
        return user.getRoles().stream()
                .map(UserRole::getRole)
                .map(Role::getName)
                .toList();
    }

    private void recordAttempt(User user, String identifier, boolean success,
                               LoginHistory.FailureReason failureReason,
                               String ipAddress, String userAgent) {
        try {
            LoginHistory history = success
                    ? LoginHistory.successfulAttempt(user, identifier, ipAddress, userAgent)
                    : new LoginHistory(user, identifier, false, failureReason, ipAddress, userAgent);
            loginHistoryRepository.save(history);
        } catch (Exception e) {
            log.error("Failed to record login history: identifier={}, success={}", identifier, success, e);
        }
    }
}
