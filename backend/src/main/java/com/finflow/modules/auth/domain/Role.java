package com.finflow.modules.auth.domain;

import com.finflow.shared.domain.BaseEntity;
import jakarta.persistence.*;

/**
 * Named permission set that can be assigned to users via {@link UserRole}.
 *
 * <p>Roles group granular permissions into meaningful sets (e.g., "Customer",
 * "Admin"). System roles are seeded at migration and cannot be modified
 * or deleted by application code.</p>
 *
 * <p>Table: {@code finflow_auth.roles}</p>
 *
 * @author FinFlow Engineering
 * @since 1.0.0
 * @see UserRole
 */
@Entity
@Table(name = "roles", catalog = "finflow_auth")
@EntityListeners({com.finflow.shared.domain.BaseEntityListener.class, org.springframework.data.jpa.domain.support.AuditingEntityListener.class})
public class Role extends BaseEntity {

    @Column(name = "name", nullable = false, unique = true, length = 50)
    private String name;

    @Column(name = "description", length = 255)
    private String description;

    @Column(name = "is_system_role", nullable = false)
    private Boolean isSystemRole = false;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    /** Default constructor required by JPA. */
    protected Role() {}

    /**
     * Creates a new role.
     *
     * @param name        the unique role name
     * @param description human-readable description
     * @param isSystemRole true if this is a system-seeded role
     */
    public Role(String name, String description, boolean isSystemRole) {
        this.name = name;
        this.description = description;
        this.isSystemRole = isSystemRole;
        this.isActive = true;
    }

    // ---- Getters ----

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public Boolean getIsSystemRole() {
        return isSystemRole;
    }

    public Boolean getIsActive() {
        return isActive;
    }
}
