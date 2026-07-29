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
import com.finflow.shared.util.SecurityUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class SettingService {

    private static final Logger log = LoggerFactory.getLogger(SettingService.class);

    private static final Set<String> BOOLEAN_KEYS = Set.of(
        "notification_email", "notification_sms", "two_factor_enabled"
    );

    private static final Set<String> LANGUAGE_VALUES = Set.of("en", "es", "fr", "de");

    private static final Set<String> CURRENCY_VALUES = Set.of("USD", "EUR", "GBP");

    private static final Set<String> THEME_VALUES = Set.of("light", "dark", "system");

    private static final Set<String> VALID_KEYS = Set.of(
        "notification_email", "notification_sms", "two_factor_enabled",
        "language", "currency_display", "theme"
    );

    private final UserSettingRepository repository;
    private final SettingMapper mapper;

    public SettingService(UserSettingRepository repository, SettingMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<SettingResponse> getSettings(String userId) {
        List<UserSetting> settings = repository.findByUserId(userId);
        return mapper.toResponseList(settings);
    }

    @Transactional(readOnly = true)
    public SettingResponse getSetting(String userId, String key) {
        validateSettingKey(key);
        UserSetting setting = repository.findByUserIdAndSettingKey(userId, key)
            .orElseThrow(() -> new ResourceNotFoundException("Setting", key));
        return mapper.toResponse(setting);
    }

    public SettingResponse updateSetting(String userId, String key, UpdateSettingRequest request) {
        validateSettingKey(key);
        validateSettingValue(key, request.settingValue());

        Optional<UserSetting> existing = repository.findByUserIdAndSettingKey(userId, key);
        UserSetting setting;

        if (existing.isPresent()) {
            setting = existing.get();
            setting.setSettingValue(request.settingValue());
        } else {
            setting = new UserSetting(userId, key, request.settingValue());
        }

        setting = repository.save(setting);
        log.info("Setting updated: userId={}, key={}, value={}", userId, key, request.settingValue());
        return mapper.toResponse(setting);
    }

    public List<SettingResponse> bulkUpdate(String userId, BulkUpdateSettingsRequest request) {
        Map<String, String> settingsMap = request.settings();

        for (Map.Entry<String, String> entry : settingsMap.entrySet()) {
            validateSettingKey(entry.getKey());
            validateSettingValue(entry.getKey(), entry.getValue());
        }

        List<UserSetting> results = new ArrayList<>();

        for (Map.Entry<String, String> entry : settingsMap.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();

            Optional<UserSetting> existing = repository.findByUserIdAndSettingKey(userId, key);
            UserSetting setting;

            if (existing.isPresent()) {
                setting = existing.get();
                setting.setSettingValue(value);
            } else {
                setting = new UserSetting(userId, key, value);
            }

            results.add(repository.save(setting));
        }

        log.info("Bulk settings updated: userId={}, count={}", userId, results.size());
        return mapper.toResponseList(results);
    }

    public void deleteSetting(String userId, String key) {
        validateSettingKey(key);
        UserSetting setting = repository.findByUserIdAndSettingKey(userId, key)
            .orElseThrow(() -> new ResourceNotFoundException("Setting", key));
        repository.delete(setting);
        log.info("Setting deleted: userId={}, key={}", userId, key);
    }

    private void validateSettingKey(String key) {
        if (!VALID_KEYS.contains(key)) {
            throw new ValidationException("Invalid setting key: " + key);
        }
    }

    private void validateSettingValue(String key, String value) {
        if (value == null || value.isBlank()) {
            throw new ValidationException("Setting value cannot be empty");
        }

        if (BOOLEAN_KEYS.contains(key)) {
            if (!"true".equals(value) && !"false".equals(value)) {
                throw new BusinessRuleException("INVALID_SETTING_VALUE",
                    "Value for '" + key + "' must be 'true' or 'false'");
            }
        } else if ("language".equals(key)) {
            if (!LANGUAGE_VALUES.contains(value)) {
                throw new BusinessRuleException("INVALID_SETTING_VALUE",
                    "Language must be one of: " + LANGUAGE_VALUES);
            }
        } else if ("currency_display".equals(key)) {
            if (!CURRENCY_VALUES.contains(value)) {
                throw new BusinessRuleException("INVALID_SETTING_VALUE",
                    "Currency must be one of: " + CURRENCY_VALUES);
            }
        } else if ("theme".equals(key)) {
            if (!THEME_VALUES.contains(value)) {
                throw new BusinessRuleException("INVALID_SETTING_VALUE",
                    "Theme must be one of: " + THEME_VALUES);
            }
        }
    }
}
