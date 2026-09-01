package com.finflow.modules.auth.mapper;

import com.finflow.modules.auth.domain.User;
import com.finflow.modules.auth.dto.RegisterResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * MapStruct mapper for transforming {@link User} entities to {@link RegisterResponse} DTOs.
 *
 * <p>Excludes all sensitive fields (credentials, internal flags) from the response.</p>
 *
 * @author FinFlow Engineering
 * @since 1.0.0
 */
@Mapper(componentModel = "spring")
public interface UserMapper {

    /**
     * Maps a User entity to a RegisterResponse DTO.
     *
     * @param user the user entity
     * @return the response DTO containing non-sensitive fields
     */
    @Mapping(source = "status", target = "status")
    RegisterResponse toRegisterResponse(User user);
}
