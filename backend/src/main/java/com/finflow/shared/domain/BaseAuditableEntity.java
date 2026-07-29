package com.finflow.shared.domain;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.LastModifiedBy;

@MappedSuperclass
public abstract class BaseAuditableEntity extends BaseEntity {

    @CreatedBy
    @Column(name = "created_by", nullable = false, updatable = false, length = 36)
    private String createdBy;

    @LastModifiedBy
    @Column(name = "modified_by", nullable = false, length = 36)
    private String modifiedBy;

    public String getCreatedBy() {
        return createdBy;
    }

    public String getModifiedBy() {
        return modifiedBy;
    }
}
