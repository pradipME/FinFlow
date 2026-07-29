package com.finflow.modules.auth.repository;

import com.finflow.modules.auth.domain.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * JPA repository for {@link Role} entities.
 *
 * @author FinFlow Engineering
 * @since 1.0.0
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, UUID> {

    Optional<Role> findByNameAndIsActiveTrue(String name);

    boolean existsByNameAndIsActiveTrue(String name);
}
