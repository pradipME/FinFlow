package com.finflow.modules.settings.service;

import com.finflow.modules.settings.domain.UserSetting;
import com.finflow.modules.settings.dto.BulkUpdateSettingsRequest;
import com.finflow.modules.settings.dto.SettingResponse;
import com.finflow.modules.settings.dto.UpdateSettingRequest;
import com.finflow.modules.settings.mapper.SettingMapper;
import com.finflow.modules.settings.repository.UserSettingRepository;
import com.finflow.shared.exception.BusinessRuleException;
import com.finflow.shared.exception.ResourceNotFoundException;
import com.finflow.shared.exception.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("SettingService Unit Tests")
class SettingServiceTest {

    @Mock private UserSettingRepository repository;
    @Mock private SettingMapper mapper;

    @InjectMocks private SettingService service;

    private String userId;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID().toString();
    }

    private UserSetting buildSetting(String key, String value) {
        UserSetting s = new UserSetting(userId, key, value);
        ReflectionTestUtils.setField(s, "id", UUID.randomUUID());
        return s;
    }

    @Nested
    @DisplayName("GET /settings")
    class GetSettings {

        @Test
        @DisplayName("returns all settings for user")
        void returnsAllSettings() {
            UserSetting s1 = buildSetting("notification_email", "true");
            UserSetting s2 = buildSetting("language", "en");
            SettingResponse r1 = mock(SettingResponse.class);
            SettingResponse r2 = mock(SettingResponse.class);

            when(repository.findByUserId(userId)).thenReturn(List.of(s1, s2));
            when(mapper.toResponseList(List.of(s1, s2))).thenReturn(List.of(r1, r2));

            List<SettingResponse> result = service.getSettings(userId);

            assertThat(result).hasSize(2);
        }

        @Test
        @DisplayName("returns empty list when no settings exist")
        void returnsEmptyList() {
            when(repository.findByUserId(userId)).thenReturn(List.of());
            when(mapper.toResponseList(List.of())).thenReturn(List.of());

            List<SettingResponse> result = service.getSettings(userId);

            assertThat(result).isEmpty();
        }
    }

    @Nested
    @DisplayName("GET /settings/{key}")
    class GetSetting {

        @Test
        @DisplayName("returns setting when found")
        void returnsSetting() {
            UserSetting s = buildSetting("language", "en");
            SettingResponse resp = mock(SettingResponse.class);
            when(repository.findByUserIdAndSettingKey(userId, "language")).thenReturn(Optional.of(s));
            when(mapper.toResponse(s)).thenReturn(resp);

            SettingResponse result = service.getSetting(userId, "language");

            assertThat(result).isEqualTo(resp);
        }

        @Test
        @DisplayName("throws ResourceNotFoundException when not found")
        void throwsNotFound() {
            when(repository.findByUserIdAndSettingKey(userId, "language")).thenReturn(Optional.empty());

            assertThatThrownBy(() -> service.getSetting(userId, "language"))
                .isInstanceOf(ResourceNotFoundException.class);
        }

        @Test
        @DisplayName("throws ValidationException for invalid key")
        void throwsOnInvalidKey() {
            assertThatThrownBy(() -> service.getSetting(userId, "invalid_key"))
                .isInstanceOf(ValidationException.class);
        }
    }

    @Nested
    @DisplayName("PATCH /settings/{key}")
    class UpdateSetting {

        @Test
        @DisplayName("creates new setting when key does not exist")
        void createsNewSetting() {
            UpdateSettingRequest req = new UpdateSettingRequest("true");
            UserSetting saved = buildSetting("notification_email", "true");
            SettingResponse resp = mock(SettingResponse.class);

            when(repository.findByUserIdAndSettingKey(userId, "notification_email"))
                .thenReturn(Optional.empty());
            when(repository.save(any(UserSetting.class))).thenReturn(saved);
            when(mapper.toResponse(saved)).thenReturn(resp);

            SettingResponse result = service.updateSetting(userId, "notification_email", req);

            assertThat(result).isEqualTo(resp);
            verify(repository).save(any(UserSetting.class));
        }

        @Test
        @DisplayName("updates existing setting value")
        void updatesExistingSetting() {
            UserSetting existing = buildSetting("notification_email", "false");
            UpdateSettingRequest req = new UpdateSettingRequest("true");
            SettingResponse resp = mock(SettingResponse.class);

            when(repository.findByUserIdAndSettingKey(userId, "notification_email"))
                .thenReturn(Optional.of(existing));
            when(repository.save(existing)).thenReturn(existing);
            when(mapper.toResponse(existing)).thenReturn(resp);

            SettingResponse result = service.updateSetting(userId, "notification_email", req);

            assertThat(existing.getSettingValue()).isEqualTo("true");
            assertThat(result).isEqualTo(resp);
        }

        @Test
        @DisplayName("throws ValidationException for invalid boolean value")
        void throwsOnInvalidBooleanValue() {
            UpdateSettingRequest req = new UpdateSettingRequest("yes");

            assertThatThrownBy(() -> service.updateSetting(userId, "notification_email", req))
                .isInstanceOf(BusinessRuleException.class);
        }

        @Test
        @DisplayName("throws ValidationException for invalid language value")
        void throwsOnInvalidLanguageValue() {
            UpdateSettingRequest req = new UpdateSettingRequest("xyz");

            assertThatThrownBy(() -> service.updateSetting(userId, "language", req))
                .isInstanceOf(BusinessRuleException.class);
        }

        @Test
        @DisplayName("accepts valid language values")
        void acceptsValidLanguageValue() {
            UpdateSettingRequest req = new UpdateSettingRequest("es");
            UserSetting saved = buildSetting("language", "es");
            SettingResponse resp = mock(SettingResponse.class);

            when(repository.findByUserIdAndSettingKey(userId, "language"))
                .thenReturn(Optional.empty());
            when(repository.save(any(UserSetting.class))).thenReturn(saved);
            when(mapper.toResponse(saved)).thenReturn(resp);

            SettingResponse result = service.updateSetting(userId, "language", req);

            assertThat(result).isEqualTo(resp);
        }
    }

    @Nested
    @DisplayName("PUT /settings/bulk")
    class BulkUpdate {

        @Test
        @DisplayName("updates multiple settings")
        void updatesMultipleSettings() {
            Map<String, String> settingsMap = Map.of(
                "notification_email", "true",
                "language", "fr"
            );
            BulkUpdateSettingsRequest req = new BulkUpdateSettingsRequest(settingsMap);

            UserSetting s1 = buildSetting("notification_email", "true");
            UserSetting s2 = buildSetting("language", "fr");
            SettingResponse r1 = mock(SettingResponse.class);
            SettingResponse r2 = mock(SettingResponse.class);

            when(repository.findByUserIdAndSettingKey(userId, "notification_email"))
                .thenReturn(Optional.empty());
            when(repository.findByUserIdAndSettingKey(userId, "language"))
                .thenReturn(Optional.empty());
            when(repository.save(any(UserSetting.class))).thenReturn(s1).thenReturn(s2);
            when(mapper.toResponseList(any())).thenReturn(List.of(r1, r2));

            List<SettingResponse> result = service.bulkUpdate(userId, req);

            assertThat(result).hasSize(2);
            verify(repository, times(2)).save(any(UserSetting.class));
        }

        @Test
        @DisplayName("throws ValidationException for any invalid key in bulk")
        void throwsOnInvalidKeyInBulk() {
            Map<String, String> settingsMap = Map.of(
                "invalid_key", "value"
            );
            BulkUpdateSettingsRequest req = new BulkUpdateSettingsRequest(settingsMap);

            assertThatThrownBy(() -> service.bulkUpdate(userId, req))
                .isInstanceOf(ValidationException.class);
        }
    }

    @Nested
    @DisplayName("DELETE /settings/{key}")
    class DeleteSetting {

        @Test
        @DisplayName("deletes existing setting")
        void deletesSetting() {
            UserSetting s = buildSetting("notification_email", "true");

            when(repository.findByUserIdAndSettingKey(userId, "notification_email"))
                .thenReturn(Optional.of(s));

            service.deleteSetting(userId, "notification_email");

            verify(repository).delete(s);
        }

        @Test
        @DisplayName("throws ResourceNotFoundException when setting not found")
        void throwsNotFound() {
            when(repository.findByUserIdAndSettingKey(userId, "notification_email"))
                .thenReturn(Optional.empty());

            assertThatThrownBy(() -> service.deleteSetting(userId, "notification_email"))
                .isInstanceOf(ResourceNotFoundException.class);
        }

        @Test
        @DisplayName("throws ValidationException for invalid key")
        void throwsOnInvalidKey() {
            assertThatThrownBy(() -> service.deleteSetting(userId, "invalid_key"))
                .isInstanceOf(ValidationException.class);
        }
    }
}
