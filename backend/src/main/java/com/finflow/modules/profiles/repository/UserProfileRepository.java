package com.finflow.modules.profiles.repository;

import com.finflow.modules.profiles.domain.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserProfileRepository extends JpaRepository<UserProfile, UUID> {
    Optional<UserProfile> findByUserId(String userId);
    boolean existsByUserId(String userId);
}
