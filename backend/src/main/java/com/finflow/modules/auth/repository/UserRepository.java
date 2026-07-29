package com.finflow.modules.auth.repository;

import com.finflow.modules.auth.domain.User;
import com.finflow.modules.auth.domain.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * JPA repository for {@link User} aggregate root.
 *
 * <p>All queries exclude soft-deleted records by default.</p>
 *
 * @author FinFlow Engineering
 * @since 1.0.0
 */
@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    boolean existsByEmailIgnoreCaseAndIsDeletedFalse(String email);

    boolean existsByPhoneNumberAndIsDeletedFalse(String phoneNumber);

    boolean existsByUsernameIgnoreCaseAndIsDeletedFalse(String username);

    Optional<User> findByEmailIgnoreCaseAndIsDeletedFalse(String email);

    Optional<User> findByUsernameIgnoreCaseAndIsDeletedFalse(String username);

    long countByStatusAndIsDeletedFalse(UserStatus status);
}
