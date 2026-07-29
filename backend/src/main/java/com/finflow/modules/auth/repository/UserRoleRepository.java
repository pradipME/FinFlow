package com.finflow.modules.auth.repository;

import com.finflow.modules.auth.domain.User;
import com.finflow.modules.auth.domain.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * JPA repository for {@link UserRole} join entities.
 *
 * @author FinFlow Engineering
 * @since 1.0.0
 */
@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, UUID> {

    @Query("SELECT ur FROM UserRole ur " +
           "JOIN FETCH ur.role r " +
           "WHERE ur.user = :user AND r.isActive = true")
    List<UserRole> findByUser(@Param("user") User user);

    boolean existsByUserAndRole_NameAndRole_IsActiveTrue(User user, String roleName);
}
