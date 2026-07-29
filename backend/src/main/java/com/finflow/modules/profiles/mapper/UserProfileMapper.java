package com.finflow.modules.profiles.mapper;

import com.finflow.modules.profiles.domain.UserProfile;
import com.finflow.modules.profiles.dto.UserProfileResponse;
import org.mapstruct.Mapper;

import java.time.format.DateTimeFormatter;

@Mapper(componentModel = "spring")
public interface UserProfileMapper {

    default UserProfileResponse toResponse(UserProfile profile) {
        if (profile == null) return null;
        return new UserProfileResponse(
                profile.getId() != null ? profile.getId().toString() : null,
                profile.getUserId(),
                profile.getFirstName(),
                profile.getLastName(),
                profile.getDateOfBirth() != null ? profile.getDateOfBirth().toString() : null,
                profile.getAddressLine1(),
                profile.getAddressLine2(),
                profile.getCity(),
                profile.getState(),
                profile.getPostalCode(),
                profile.getCountry(),
                profile.getAvatarUrl(),
                profile.getCreatedAt() != null ? profile.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null,
                profile.getUpdatedAt() != null ? profile.getUpdatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null
        );
    }
}
