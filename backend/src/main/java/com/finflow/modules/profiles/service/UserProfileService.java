package com.finflow.modules.profiles.service;

import com.finflow.modules.auth.domain.User;
import com.finflow.modules.auth.repository.UserRepository;
import com.finflow.modules.profiles.domain.UserProfile;
import com.finflow.modules.profiles.dto.UpdateProfileRequest;
import com.finflow.modules.profiles.dto.UserProfileResponse;
import com.finflow.modules.profiles.mapper.UserProfileMapper;
import com.finflow.modules.profiles.repository.UserProfileRepository;
import com.finflow.shared.util.SecurityUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;

@Service
public class UserProfileService {

    private static final Logger log = LoggerFactory.getLogger(UserProfileService.class);

    private final UserProfileRepository userProfileRepository;
    private final UserProfileMapper userProfileMapper;
    private final UserRepository userRepository;

    public UserProfileService(UserProfileRepository userProfileRepository,
                              UserProfileMapper userProfileMapper,
                              UserRepository userRepository) {
        this.userProfileRepository = userProfileRepository;
        this.userProfileMapper = userProfileMapper;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public UserProfileResponse getProfile() {
        String userId = SecurityUtil.getCurrentUserId();
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseGet(() -> createDefaultProfile(userId));
        return userProfileMapper.toResponse(profile, resolvePhone(userId));
    }

    @Transactional
    public UserProfileResponse updateProfile(UpdateProfileRequest request) {
        String userId = SecurityUtil.getCurrentUserId();
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseGet(() -> createDefaultProfile(userId));

        LocalDate dateOfBirth = request.dateOfBirth() != null
                ? LocalDate.parse(request.dateOfBirth())
                : null;

        UserProfile.UpdateProfileData data = new UserProfile.UpdateProfileData(
                request.firstName(),
                request.lastName(),
                dateOfBirth,
                request.addressLine1(),
                request.addressLine2(),
                request.city(),
                request.state(),
                request.postalCode(),
                request.country(),
                request.avatarUrl()
        );

        profile.updateFrom(data);
        profile = userProfileRepository.save(profile);
        log.info("Profile updated: userId={}", userId);
        return userProfileMapper.toResponse(profile, resolvePhone(userId));
    }

    private String resolvePhone(String userId) {
        return userRepository.findById(UUID.fromString(userId))
                .map(User::getPhoneNumber)
                .orElse(null);
    }

    private UserProfile createDefaultProfile(String userId) {
        UserProfile profile = new UserProfile(userId);
        profile = userProfileRepository.save(profile);
        log.info("Default profile created: userId={}", userId);
        return profile;
    }
}
