package com.finflow.modules.profiles.service;

import com.finflow.modules.auth.domain.User;
import com.finflow.modules.auth.domain.UserStatus;
import com.finflow.modules.auth.repository.UserRepository;
import com.finflow.modules.profiles.domain.UserProfile;
import com.finflow.modules.profiles.dto.UpdateProfileRequest;
import com.finflow.modules.profiles.dto.UserProfileResponse;
import com.finflow.modules.profiles.mapper.UserProfileMapper;
import com.finflow.modules.profiles.repository.UserProfileRepository;
import com.finflow.shared.exception.ResourceNotFoundException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserProfileServiceTest {

    @Mock
    private UserProfileRepository userProfileRepository;

    @Mock
    private UserProfileMapper userProfileMapper;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserProfileService userProfileService;

    private UserProfile testProfile;
    private UUID testProfileId;
    private String testUserId;
    private static final String TEST_PHONE = "+2348012345678";

    @BeforeEach
    void setUp() {
        testProfileId = UUID.randomUUID();
        testUserId = UUID.randomUUID().toString();
        testProfile = new UserProfile(testUserId);
        ReflectionTestUtils.setField(testProfile, "id", testProfileId);
        testProfile.setFirstName("John");
        testProfile.setLastName("Doe");

        var auth = new UsernamePasswordAuthenticationToken(
                testUserId, null, List.of(new SimpleGrantedAuthority("ROLE_CUSTOMER")));
        SecurityContextHolder.getContext().setAuthentication(auth);

        User user = new User("john@example.com", "john", TEST_PHONE, java.time.LocalDateTime.now());
        when(userRepository.findById(UUID.fromString(testUserId))).thenReturn(Optional.of(user));
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Nested
    @DisplayName("Get Profile")
    class GetProfile {

        @Test
        @DisplayName("Should return existing profile")
        void getProfile_existing() {
            when(userProfileRepository.findByUserId(testUserId)).thenReturn(Optional.of(testProfile));

            UserProfileResponse response = new UserProfileResponse(
                    testProfileId.toString(), testUserId, TEST_PHONE, "John", "Doe", null,
                    null, null, null, null, null, null, null,
                    null, null);
            when(userProfileMapper.toResponse(eq(testProfile), anyString())).thenReturn(response);

            UserProfileResponse result = userProfileService.getProfile();

            assertThat(result).isNotNull();
            assertThat(result.firstName()).isEqualTo("John");
            assertThat(result.lastName()).isEqualTo("Doe");
            verify(userProfileRepository).findByUserId(testUserId);
        }

        @Test
        @DisplayName("Should create and return default profile when none exists")
        void getProfile_createsDefault() {
            when(userProfileRepository.findByUserId(testUserId)).thenReturn(Optional.empty());
            when(userProfileRepository.save(any(UserProfile.class))).thenReturn(testProfile);

            UserProfileResponse response = new UserProfileResponse(
                    testProfileId.toString(), testUserId, TEST_PHONE, null, null, null,
                    null, null, null, null, null, null, null,
                    null, null);
            when(userProfileMapper.toResponse(eq(testProfile), anyString())).thenReturn(response);

            UserProfileResponse result = userProfileService.getProfile();

            assertThat(result).isNotNull();
            verify(userProfileRepository).save(any(UserProfile.class));
        }
    }

    @Nested
    @DisplayName("Update Profile")
    class UpdateProfile {

        @Test
        @DisplayName("Should update profile fields successfully")
        void updateProfile_success() {
            when(userProfileRepository.findByUserId(testUserId)).thenReturn(Optional.of(testProfile));
            when(userProfileRepository.save(any(UserProfile.class))).thenReturn(testProfile);

            UpdateProfileRequest request = new UpdateProfileRequest(
                    "Jane", "Smith", "1995-06-15",
                    "456 Oak Ave", null, "Boston", "MA", "02101", "US", null);
            when(userProfileMapper.toResponse(eq(testProfile), anyString())).thenReturn(new UserProfileResponse(
                    testProfileId.toString(), testUserId, TEST_PHONE, "Jane", "Smith", "1995-06-15",
                    "456 Oak Ave", null, "Boston", "MA", "02101", "US", null,
                    null, null));

            UserProfileResponse result = userProfileService.updateProfile(request);

            assertThat(result).isNotNull();
            assertThat(result.firstName()).isEqualTo("Jane");
            assertThat(result.lastName()).isEqualTo("Smith");
            verify(userProfileRepository).save(any(UserProfile.class));
        }

        @Test
        @DisplayName("Should create profile on update when none exists")
        void updateProfile_createsProfile() {
            when(userProfileRepository.findByUserId(testUserId)).thenReturn(Optional.empty());
            when(userProfileRepository.save(any(UserProfile.class))).thenReturn(testProfile);

            UpdateProfileRequest request = new UpdateProfileRequest(
                    "Jane", "Smith", null,
                    null, null, null, null, null, null, null);
            when(userProfileMapper.toResponse(eq(testProfile), anyString())).thenReturn(new UserProfileResponse(
                    testProfileId.toString(), testUserId, TEST_PHONE, "Jane", "Smith", null,
                    null, null, null, null, null, null, null,
                    null, null));

            UserProfileResponse result = userProfileService.updateProfile(request);

            assertThat(result).isNotNull();
            verify(userProfileRepository, times(2)).save(any(UserProfile.class));
        }

        @Test
        @DisplayName("Should handle partial updates with null fields")
        void updateProfile_partialUpdate() {
            when(userProfileRepository.findByUserId(testUserId)).thenReturn(Optional.of(testProfile));
            when(userProfileRepository.save(any(UserProfile.class))).thenReturn(testProfile);

            UpdateProfileRequest request = new UpdateProfileRequest(
                    "Jane", null, null,
                    null, null, null, null, null, null, null);
            when(userProfileMapper.toResponse(eq(testProfile), anyString())).thenReturn(new UserProfileResponse(
                    testProfileId.toString(), testUserId, TEST_PHONE, "Jane", "Doe", null,
                    null, null, null, null, null, null, null,
                    null, null));

            UserProfileResponse result = userProfileService.updateProfile(request);

            assertThat(result).isNotNull();
            verify(userProfileRepository).save(any(UserProfile.class));
        }

        @Test
        @DisplayName("Should parse date of birth correctly")
        void updateProfile_dateOfBirth() {
            when(userProfileRepository.findByUserId(testUserId)).thenReturn(Optional.of(testProfile));
            when(userProfileRepository.save(any(UserProfile.class))).thenReturn(testProfile);

            UpdateProfileRequest request = new UpdateProfileRequest(
                    null, null, "1990-01-15",
                    null, null, null, null, null, null, null);
            when(userProfileMapper.toResponse(eq(testProfile), anyString())).thenReturn(new UserProfileResponse(
                    testProfileId.toString(), testUserId, TEST_PHONE, null, null, "1990-01-15",
                    null, null, null, null, null, null, null,
                    null, null));

            UserProfileResponse result = userProfileService.updateProfile(request);

            assertThat(result).isNotNull();
            assertThat(result.dateOfBirth()).isEqualTo("1990-01-15");
        }

        @Test
        @DisplayName("Should update address fields")
        void updateProfile_address() {
            when(userProfileRepository.findByUserId(testUserId)).thenReturn(Optional.of(testProfile));
            when(userProfileRepository.save(any(UserProfile.class))).thenReturn(testProfile);

            UpdateProfileRequest request = new UpdateProfileRequest(
                    null, null, null,
                    "789 Pine St", "Suite 100", "Seattle", "WA", "98101", "US", null);
            when(userProfileMapper.toResponse(eq(testProfile), anyString())).thenReturn(new UserProfileResponse(
                    testProfileId.toString(), testUserId, TEST_PHONE, null, null, null,
                    "789 Pine St", "Suite 100", "Seattle", "WA", "98101", "US", null,
                    null, null));

            UserProfileResponse result = userProfileService.updateProfile(request);

            assertThat(result).isNotNull();
            assertThat(result.addressLine1()).isEqualTo("789 Pine St");
            assertThat(result.city()).isEqualTo("Seattle");
            assertThat(result.country()).isEqualTo("US");
        }

        @Test
        @DisplayName("Should update avatar URL")
        void updateProfile_avatarUrl() {
            when(userProfileRepository.findByUserId(testUserId)).thenReturn(Optional.of(testProfile));
            when(userProfileRepository.save(any(UserProfile.class))).thenReturn(testProfile);

            UpdateProfileRequest request = new UpdateProfileRequest(
                    null, null, null,
                    null, null, null, null, null, null, "https://cdn.example.com/avatar.jpg");
            when(userProfileMapper.toResponse(eq(testProfile), anyString())).thenReturn(new UserProfileResponse(
                    testProfileId.toString(), testUserId, TEST_PHONE, null, null, null,
                    null, null, null, null, null, null, "https://cdn.example.com/avatar.jpg",
                    null, null));

            UserProfileResponse result = userProfileService.updateProfile(request);

            assertThat(result).isNotNull();
            assertThat(result.avatarUrl()).isEqualTo("https://cdn.example.com/avatar.jpg");
        }
    }
}
