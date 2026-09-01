package com.finflow.modules.auth.service;

import com.finflow.modules.auth.domain.*;
import com.finflow.modules.auth.dto.AuthenticationResult;
import com.finflow.modules.auth.dto.LoginRequest;
import com.finflow.modules.auth.repository.LoginHistoryRepository;
import com.finflow.modules.auth.repository.UserCredentialRepository;
import com.finflow.modules.auth.repository.UserRepository;
import com.finflow.modules.auth.validator.LoginValidator;
import com.finflow.shared.config.JwtTokenProvider;
import com.finflow.shared.exception.BusinessRuleException;
import com.finflow.shared.exception.UnauthorizedException;
import com.finflow.shared.exception.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthenticationService")
class AuthenticationServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private UserCredentialRepository credentialRepository;
    @Mock
    private LoginHistoryRepository loginHistoryRepository;
    @Mock
    private LoginValidator validator;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private ApplicationEventPublisher eventPublisher;
    @Mock
    private JwtTokenProvider jwtTokenProvider;
    @Mock
    private RefreshTokenService refreshTokenService;

    @InjectMocks
    private AuthenticationService authenticationService;

    private User activeUser;
    private UserCredential activeCredential;
    private Role customerRole;
    private LoginRequest validRequest;

    @BeforeEach
    void setUp() {
        customerRole = new Role("CUSTOMER", "Standard customer role", true);
        customerRole.setId(UUID.randomUUID());

        activeUser = new User("test@finflow.com", "testuser", "+2348012345678", LocalDateTime.now());
        activeUser.setId(UUID.randomUUID());
        activeUser.setStatus(UserStatus.ACTIVE);
        activeUser.setFailedLoginCount(0);

        UserRole userRole = new UserRole(activeUser, customerRole, "system");
        userRole.setId(UUID.randomUUID());
        activeUser.setRoles(Set.of(userRole));

        activeCredential = new UserCredential(activeUser, CredentialType.PASSWORD, "hashed-password");
        activeCredential.setId(UUID.randomUUID());

        validRequest = new LoginRequest("test@finflow.com", "Str0ng!Pass#2026");
    }

    @Nested
    @DisplayName("authenticate()")
    class Authenticate {

        @Test
        @DisplayName("should authenticate successfully with email")
        void shouldAuthenticateWithEmail() {
            when(userRepository.findByEmailIgnoreCaseAndIsDeletedFalse("test@finflow.com")).thenReturn(Optional.of(activeUser));
            when(credentialRepository.findByUserAndCredentialTypeAndIsActiveTrueAndIsDeletedFalse(activeUser, CredentialType.PASSWORD))
                    .thenReturn(Optional.of(activeCredential));
            when(passwordEncoder.matches("Str0ng!Pass#2026", "hashed-password")).thenReturn(true);
            when(jwtTokenProvider.generateAccessToken(
                    activeUser.getId().toString(),
                    activeUser.getEmail(),
                    List.of("CUSTOMER"),
                    List.of()
            )).thenReturn("mock-jwt-token");

            AuthenticationResult result = authenticationService.authenticate(
                    validRequest, "192.168.1.1", "Mozilla/5.0");

            assertThat(result).isNotNull();
            assertThat(result.accessToken()).isEqualTo("mock-jwt-token");
            assertThat(result.userId()).isEqualTo(activeUser.getId());
            assertThat(result.email()).isEqualTo("test@finflow.com");
            assertThat(result.username()).isEqualTo("testuser");
            assertThat(result.status()).isEqualTo("ACTIVE");
            assertThat(result.roles()).contains("CUSTOMER");
            assertThat(result.authenticatedAt()).isNotNull();

            verify(userRepository).save(activeUser);
            verify(credentialRepository).save(activeCredential);
            verify(loginHistoryRepository).save(any(LoginHistory.class));
            verify(eventPublisher).publishEvent(any(UserLoggedInEvent.class));
        }

        @Test
        @DisplayName("should authenticate successfully with username")
        void shouldAuthenticateWithUsername() {
            LoginRequest usernameRequest = new LoginRequest("testuser", "Str0ng!Pass#2026");
            when(userRepository.findByUsernameIgnoreCaseAndIsDeletedFalse("testuser")).thenReturn(Optional.of(activeUser));
            when(credentialRepository.findByUserAndCredentialTypeAndIsActiveTrueAndIsDeletedFalse(activeUser, CredentialType.PASSWORD))
                    .thenReturn(Optional.of(activeCredential));
            when(passwordEncoder.matches("Str0ng!Pass#2026", "hashed-password")).thenReturn(true);
            when(jwtTokenProvider.generateAccessToken(
                    activeUser.getId().toString(),
                    activeUser.getEmail(),
                    List.of("CUSTOMER"),
                    List.of()
            )).thenReturn("mock-jwt-token");

            AuthenticationResult result = authenticationService.authenticate(
                    usernameRequest, "192.168.1.1", "Mozilla/5.0");

            assertThat(result).isNotNull();
            assertThat(result.accessToken()).isEqualTo("mock-jwt-token");
            assertThat(result.userId()).isEqualTo(activeUser.getId());
            verify(userRepository).findByUsernameIgnoreCaseAndIsDeletedFalse("testuser");
            verify(userRepository, never()).findByEmailIgnoreCaseAndIsDeletedFalse(any());
        }

        @Test
        @DisplayName("should reject non-existent user with generic error")
        void shouldRejectNonExistentUser() {
            when(userRepository.findByEmailIgnoreCaseAndIsDeletedFalse("unknown@finflow.com")).thenReturn(Optional.empty());

            assertThatThrownBy(() -> authenticationService.authenticate(
                    new LoginRequest("unknown@finflow.com", "password"),
                    "192.168.1.1", "Mozilla/5.0"))
                    .isInstanceOf(UnauthorizedException.class);

            verify(passwordEncoder).matches(eq("password"), anyString());
            verify(loginHistoryRepository).save(argThat(history ->
                    history.getUser() == null &&
                    history.getSuccess() == false &&
                    history.getFailureReason() == LoginHistory.FailureReason.INVALID_CREDENTIALS
            ));
        }

        @Test
        @DisplayName("should reject deleted user")
        void shouldRejectDeletedUser() {
            activeUser.softDelete("admin");
            when(userRepository.findByEmailIgnoreCaseAndIsDeletedFalse("test@finflow.com")).thenReturn(Optional.of(activeUser));

            assertThatThrownBy(() -> authenticationService.authenticate(
                    validRequest, "192.168.1.1", "Mozilla/5.0"))
                    .isInstanceOf(UnauthorizedException.class);

            verify(loginHistoryRepository).save(argThat(history ->
                    history.getFailureReason() == LoginHistory.FailureReason.INVALID_CREDENTIALS
            ));
        }

        @Test
        @DisplayName("should reject suspended user")
        void shouldRejectSuspendedUser() {
            activeUser.setStatus(UserStatus.SUSPENDED);
            when(userRepository.findByEmailIgnoreCaseAndIsDeletedFalse("test@finflow.com")).thenReturn(Optional.of(activeUser));

            assertThatThrownBy(() -> authenticationService.authenticate(
                    validRequest, "192.168.1.1", "Mozilla/5.0"))
                    .isInstanceOf(UnauthorizedException.class);

            verify(loginHistoryRepository).save(argThat(history ->
                    history.getFailureReason() == LoginHistory.FailureReason.ACCOUNT_SUSPENDED
            ));
        }

        @Test
        @DisplayName("should reject closed user")
        void shouldRejectClosedUser() {
            activeUser.setStatus(UserStatus.CLOSED);
            when(userRepository.findByEmailIgnoreCaseAndIsDeletedFalse("test@finflow.com")).thenReturn(Optional.of(activeUser));

            assertThatThrownBy(() -> authenticationService.authenticate(
                    validRequest, "192.168.1.1", "Mozilla/5.0"))
                    .isInstanceOf(UnauthorizedException.class);

            verify(loginHistoryRepository).save(argThat(history ->
                    history.getFailureReason() == LoginHistory.FailureReason.ACCOUNT_CLOSED
            ));
        }

        @Test
        @DisplayName("should reject locked user")
        void shouldRejectLockedUser() {
            activeUser.setLockedUntil(LocalDateTime.now().plusMinutes(30));
            when(userRepository.findByEmailIgnoreCaseAndIsDeletedFalse("test@finflow.com")).thenReturn(Optional.of(activeUser));

            assertThatThrownBy(() -> authenticationService.authenticate(
                    validRequest, "192.168.1.1", "Mozilla/5.0"))
                    .isInstanceOf(BusinessRuleException.class)
                    .satisfies(ex -> {
                        BusinessRuleException bre = (BusinessRuleException) ex;
                        assertThat(bre.getCode()).isEqualTo("ACCOUNT_LOCKED");
                    });

            verify(loginHistoryRepository).save(argThat(history ->
                    history.getFailureReason() == LoginHistory.FailureReason.ACCOUNT_LOCKED
            ));
        }

        @Test
        @DisplayName("should reject wrong password and increment failed count")
        void shouldRejectWrongPassword() {
            when(userRepository.findByEmailIgnoreCaseAndIsDeletedFalse("test@finflow.com")).thenReturn(Optional.of(activeUser));
            when(credentialRepository.findByUserAndCredentialTypeAndIsActiveTrueAndIsDeletedFalse(activeUser, CredentialType.PASSWORD))
                    .thenReturn(Optional.of(activeCredential));
            when(passwordEncoder.matches("wrong-password", "hashed-password")).thenReturn(false);

            assertThatThrownBy(() -> authenticationService.authenticate(
                    new LoginRequest("test@finflow.com", "wrong-password"),
                    "192.168.1.1", "Mozilla/5.0"))
                    .isInstanceOf(UnauthorizedException.class);

            ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
            verify(userRepository).save(userCaptor.capture());
            assertThat(userCaptor.getValue().getFailedLoginCount()).isEqualTo(1);
        }

        @Test
        @DisplayName("should lock account after 5 failed attempts")
        void shouldLockAfterFiveFailures() {
            activeUser.setFailedLoginCount(4);
            when(userRepository.findByEmailIgnoreCaseAndIsDeletedFalse("test@finflow.com")).thenReturn(Optional.of(activeUser));
            when(credentialRepository.findByUserAndCredentialTypeAndIsActiveTrueAndIsDeletedFalse(activeUser, CredentialType.PASSWORD))
                    .thenReturn(Optional.of(activeCredential));
            when(passwordEncoder.matches(anyString(), eq("hashed-password"))).thenReturn(false);

            assertThatThrownBy(() -> authenticationService.authenticate(
                    new LoginRequest("test@finflow.com", "wrong"),
                    "192.168.1.1", "Mozilla/5.0"))
                    .isInstanceOf(BusinessRuleException.class)
                    .satisfies(ex -> {
                        BusinessRuleException bre = (BusinessRuleException) ex;
                        assertThat(bre.getCode()).isEqualTo("ACCOUNT_LOCKED");
                    });

            verify(loginHistoryRepository).save(argThat(history ->
                    history.getFailureReason() == LoginHistory.FailureReason.ACCOUNT_LOCKED
            ));
        }

        @Test
        @DisplayName("should reset failed count on successful login")
        void shouldResetFailedCountOnSuccess() {
            activeUser.setFailedLoginCount(3);
            when(userRepository.findByEmailIgnoreCaseAndIsDeletedFalse("test@finflow.com")).thenReturn(Optional.of(activeUser));
            when(credentialRepository.findByUserAndCredentialTypeAndIsActiveTrueAndIsDeletedFalse(activeUser, CredentialType.PASSWORD))
                    .thenReturn(Optional.of(activeCredential));
            when(passwordEncoder.matches("Str0ng!Pass#2026", "hashed-password")).thenReturn(true);
            when(jwtTokenProvider.generateAccessToken(
                    activeUser.getId().toString(),
                    activeUser.getEmail(),
                    List.of("CUSTOMER"),
                    List.of()
            )).thenReturn("mock-jwt-token");

            authenticationService.authenticate(validRequest, "192.168.1.1", "Mozilla/5.0");

            ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
            verify(userRepository).save(userCaptor.capture());
            assertThat(userCaptor.getValue().getFailedLoginCount()).isEqualTo(0);
            assertThat(userCaptor.getValue().getLockedUntil()).isNull();
        }

        @Test
        @DisplayName("should throw validation exception when request is invalid")
        void shouldThrowValidationException() {
            doThrow(new ValidationException("Invalid request"))
                    .when(validator).validate(any(LoginRequest.class));

            assertThatThrownBy(() -> authenticationService.authenticate(
                    new LoginRequest("", ""),
                    "192.168.1.1", "Mozilla/5.0"))
                    .isInstanceOf(ValidationException.class);
        }
    }
}
