package com.finflow.shared.domain;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;

@MappedSuperclass
public abstract class BaseSoftDeletableEntity extends BaseAuditableEntity {

    @Column(name = "deleted_at")
    private java.time.LocalDateTime deletedAt;

    @Column(name = "deleted_by", length = 36)
    private String deletedBy;

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;

    public void softDelete(String userId) {
        this.isDeleted = true;
        this.deletedAt = java.time.LocalDateTime.now();
        this.deletedBy = userId;
    }

    public void restore() {
        this.isDeleted = false;
        this.deletedAt = null;
        this.deletedBy = null;
    }

    public Boolean getIsDeleted() {
        return isDeleted;
    }

    public java.time.LocalDateTime getDeletedAt() {
        return deletedAt;
    }

    public String getDeletedBy() {
        return deletedBy;
    }
}
