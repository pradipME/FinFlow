package com.finflow.modules.settings.mapper;

import com.finflow.modules.settings.domain.UserSetting;
import com.finflow.modules.settings.dto.SettingResponse;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
public class SettingMapper {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    public SettingResponse toResponse(UserSetting setting) {
        return new SettingResponse(
            setting.getId() != null ? setting.getId().toString() : null,
            setting.getSettingKey(),
            setting.getSettingValue(),
            setting.getCreatedAt() != null ? setting.getCreatedAt().format(FORMATTER) : null,
            setting.getUpdatedAt() != null ? setting.getUpdatedAt().format(FORMATTER) : null
        );
    }

    public List<SettingResponse> toResponseList(List<UserSetting> settings) {
        return settings.stream().map(this::toResponse).toList();
    }
}
