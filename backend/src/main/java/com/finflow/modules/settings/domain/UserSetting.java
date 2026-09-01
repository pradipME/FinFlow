package com.finflow.modules.settings.domain;

import com.finflow.shared.domain.BaseEntity;
import com.finflow.shared.domain.BaseEntityListener;
import jakarta.persistence.*;

@Entity
@Table(name = "user_settings", schema = "finflow_settings")
@EntityListeners({BaseEntityListener.class, org.springframework.data.jpa.domain.support.AuditingEntityListener.class})
public class UserSetting extends BaseEntity {

    @Column(name = "user_id", nullable = false, length = 36, columnDefinition = "CHAR(36)")
    private String userId;

    @Column(name = "setting_key", nullable = false, length = 100)
    private String settingKey;

    @Column(name = "setting_value", nullable = false, columnDefinition = "TEXT")
    private String settingValue;

    protected UserSetting() {}

    public UserSetting(String userId, String settingKey, String settingValue) {
        this.userId = userId;
        this.settingKey = settingKey;
        this.settingValue = settingValue;
    }

    public String getUserId() { return userId; }
    public String getSettingKey() { return settingKey; }
    public String getSettingValue() { return settingValue; }

    public void setSettingValue(String settingValue) { this.settingValue = settingValue; }
}
