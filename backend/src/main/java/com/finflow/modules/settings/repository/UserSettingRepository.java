package com.finflow.modules.settings.repository;

import com.finflow.modules.settings.domain.UserSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserSettingRepository extends JpaRepository<UserSetting, UUID> {

    @Query("SELECT us FROM UserSetting us WHERE us.userId = :userId ORDER BY us.settingKey")
    List<UserSetting> findByUserId(@Param("userId") String userId);

    @Query("SELECT us FROM UserSetting us WHERE us.userId = :userId AND us.settingKey = :key")
    Optional<UserSetting> findByUserIdAndSettingKey(@Param("userId") String userId, @Param("key") String settingKey);

    @Query("SELECT us FROM UserSetting us WHERE us.userId = :userId AND us.settingKey IN :keys")
    List<UserSetting> findByUserIdAndSettingKeyIn(@Param("userId") String userId, @Param("keys") List<String> keys);

    void deleteByUserIdAndSettingKey(String userId, String settingKey);
}
