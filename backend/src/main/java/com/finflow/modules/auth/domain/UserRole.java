package com.finflow.modules.auth.domain;

import com.finflow.shared.domain.BaseEntity;
import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Join entity linking a {@link User} to a {@link Role}.
 *
 * <p>Each assignment records when the role was granted and by whom.
 * Users receive the CUSTOMER role at registration.</p>
 *
 * <p>Table: {@code finflow_auth.user_roles}</p>
 *
 * <h3>Business Rules</h3>
 * <ul>
 *   <li>A user may hold each role at most once.</li>
 *   <li>Role changes are audited (granted_at, granted_by).</li>
 * </ul>
 *
 * @author FinFlow Engineering
 * @since 1.0.0
 */
@Entity
@Table(name = "user_roles", catalog = "finflow_auth",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "role_id"}))
@EntityListeners({com.finflow.shared.domain.BaseEntityListener.class, org.springframework.data.jpa.domain.support.AuditingEntityListener.class})
public class UserRole extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false,
                foreignKey = @ForeignKey(name = "fk_ur_user"))
    private User user;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "role_id", nullable = false,
                foreignKey = @ForeignKey(name = "fk_ur_role"))
    private Role role;

    @Column(name = "granted_at", nullable = false, updatable = false)
    private LocalDateTime grantedAt;

    @Column(name = "granted_by", nullable = false, updatable = false, length = 36)
    private String grantedBy;

    /** Default constructor required by JPA. */
    protected UserRole() {}

    /**
     * Creates a new user-role assignment.
     *
     * @param user      the user receiving the role
     * @param role      the role being assigned
     * @param grantedBy the principal granting the role (user ID or "system")
     */
    public UserRole(User user, Role role, String grantedBy) {
        this.user = user;
        this.role = role;
        this.grantedBy = grantedBy;
        this.grantedAt = LocalDateTime.now();
    }

    // ---- Getters ----

    public User getUser() {
        return user;
    }

    public Role getRole() {
        return role;
    }

    public LocalDateTime getGrantedAt() {
        return grantedAt;
    }

    public String getGrantedBy() {
        return grantedBy;
    }
}
