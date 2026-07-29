package com.finflow.modules.auth.repository;

import com.finflow.modules.auth.domain.CredentialType;
import com.finflow.modules.auth.domain.User;
import com.finflow.modules.auth.domain.UserCredential;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * JPA repository for {@link UserCredential} entities.
 *
 * @author FinFlow Engineering
 * @since 1.0.0
 */
@Repository
public interface UserCredentialRepository extends JpaRepository<UserCredential, UUID> {

    Optional<UserCredential> findByUserAndCredentialTypeAndIsActiveTrueAndIsDeletedFalse(
            User user, CredentialType credentialType);

    boolean existsByUserAndCredentialTypeAndIsActiveTrueAndIsDeletedFalse(
            User user, CredentialType credentialType);

    @Query("UPDATE UserCredential uc SET uc.isActive = false " +
           "WHERE uc.user = :user AND uc.credentialType = :credentialType " +
           "AND uc.isActive = true AND uc.isDeleted = false")
    void revokeAllByUserAndType(
            @Param("user") User user,
            @Param("credentialType") CredentialType credentialType);
}
