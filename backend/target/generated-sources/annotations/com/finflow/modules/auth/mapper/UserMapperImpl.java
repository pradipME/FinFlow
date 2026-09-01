package com.finflow.modules.auth.mapper;

import com.finflow.modules.auth.domain.User;
import com.finflow.modules.auth.dto.RegisterResponse;
import java.time.LocalDateTime;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-09-01T21:05:59+0530",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public RegisterResponse toRegisterResponse(User user) {
        if ( user == null ) {
            return null;
        }

        String status = null;
        Boolean emailVerified = null;
        UUID id = null;
        String email = null;
        String username = null;
        LocalDateTime createdAt = null;

        if ( user.getStatus() != null ) {
            status = user.getStatus().name();
        }
        emailVerified = user.getEmailVerified();
        id = user.getId();
        email = user.getEmail();
        username = user.getUsername();
        createdAt = user.getCreatedAt();

        RegisterResponse registerResponse = new RegisterResponse( id, email, username, status, emailVerified, createdAt );

        return registerResponse;
    }
}
