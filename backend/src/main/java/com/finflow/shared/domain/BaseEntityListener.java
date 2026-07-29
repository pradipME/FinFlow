package com.finflow.shared.domain;

import com.finflow.shared.util.DateUtil;
import java.time.LocalDateTime;

public abstract class BaseEntityListener {

    protected void validateCreatedAt(BaseEntity entity) {
        if (entity.getCreatedAt() == null) {
            throw new IllegalStateException("Entity createdAt cannot be null after persist");
        }
    }

    protected void validateId(BaseEntity entity) {
        if (entity.getId() == null) {
            throw new IllegalStateException("Entity ID cannot be null after persist");
        }
    }
}
