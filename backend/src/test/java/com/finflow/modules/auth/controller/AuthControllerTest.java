package com.finflow.modules.auth.controller;

import com.finflow.modules.auth.dto.RegisterRequest;
import com.finflow.modules.auth.dto.RegisterResponse;
import com.finflow.modules.auth.service.RegistrationService;
import com.finflow.shared.dto.ApiResponse;
import com.finflow.shared.exception.GlobalExceptionHandler;
import com.finflow.shared.exception.ValidationException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthController")
class AuthControllerTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @Mock
    private RegistrationService registrationService;

    @InjectMocks
    private AuthController authController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(authController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
        objectMapper = new ObjectMapper();
    }

    @Nested
    @DisplayName("POST /api/v1/auth/register")
    class RegisterEndpoint {

        private RegisterRequest validRequest;
        private RegisterResponse successResponse;

        @BeforeEach
        void setUp() {
            validRequest = new RegisterRequest(
                    "test@finflow.com",
                    "+2348012345678",
                    "testuser",
                    "Str0ng!Pass#2026",
                    true
            );

            successResponse = new RegisterResponse(
                    UUID.randomUUID(),
                    "test@finflow.com",
                    "testuser",
                    "+2348012345678",
                    "ACTIVE",
                    LocalDateTime.now()
            );
        }

        @Test
        @DisplayName("should return 201 with user data on successful registration")
        void shouldReturn201OnSuccess() throws Exception {
            when(registrationService.register(any(RegisterRequest.class)))
                    .thenReturn(successResponse);

            mockMvc.perform(post("/api/v1/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(validRequest)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data.email", is("test@finflow.com")))
                    .andExpect(jsonPath("$.data.username", is("testuser")))
                    .andExpect(jsonPath("$.data.status", is("ACTIVE")))
                    .andExpect(jsonPath("$.meta.message", is("User registered successfully")));

            verify(registrationService).register(any(RegisterRequest.class));
        }

        @Test
        @DisplayName("should return 400 when required fields are missing")
        void shouldReturn400WhenMissingFields() throws Exception {
            String invalidRequest = """
                    {
                        "email": "",
                        "username": "",
                        "password": "",
                        "termsAccepted": false
                    }
                    """;

            mockMvc.perform(post("/api/v1/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(invalidRequest))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success", is(false)))
                    .andExpect(jsonPath("$.code", is("VALIDATION_ERROR")));

            verify(registrationService, never()).register(any());
        }

        @Test
        @DisplayName("should return 400 when email format is invalid")
        void shouldReturn400WhenEmailInvalid() throws Exception {
            String invalidEmailRequest = """
                    {
                        "email": "not-an-email",
                        "username": "testuser",
                        "password": "Str0ng!Pass#2026",
                        "termsAccepted": true
                    }
                    """;

            mockMvc.perform(post("/api/v1/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(invalidEmailRequest))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success", is(false)));

            verify(registrationService, never()).register(any());
        }

        @Test
        @DisplayName("should return 400 when password does not meet policy")
        void shouldReturn400WhenPasswordWeak() throws Exception {
            String weakPasswordRequest = """
                    {
                        "email": "test@finflow.com",
                        "username": "testuser",
                        "password": "weak",
                        "termsAccepted": true
                    }
                    """;

            mockMvc.perform(post("/api/v1/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(weakPasswordRequest))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success", is(false)));

            verify(registrationService, never()).register(any());
        }

        @Test
        @DisplayName("should return 400 when terms not accepted")
        void shouldReturn400WhenTermsNotAccepted() throws Exception {
            String noTermsRequest = """
                    {
                        "email": "test@finflow.com",
                        "username": "testuser",
                        "password": "Str0ng!Pass#2026",
                        "termsAccepted": false
                    }
                    """;

            mockMvc.perform(post("/api/v1/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(noTermsRequest))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success", is(false)));

            verify(registrationService, never()).register(any());
        }

        @Test
        @DisplayName("should return 409 when email or username already exists")
        void shouldReturn409WhenConflict() throws Exception {
            when(registrationService.register(any(RegisterRequest.class)))
                    .thenThrow(new ValidationException(List.of(
                            new ValidationException.FieldError("email", "DUPLICATE_RESOURCE", "Email already exists")
                    )));

            mockMvc.perform(post("/api/v1/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(validRequest)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success", is(false)))
                    .andExpect(jsonPath("$.code", is("VALIDATION_ERROR")));
        }

        @Test
        @DisplayName("should return 400 when username format is invalid")
        void shouldReturn400WhenUsernameInvalid() throws Exception {
            String invalidUsername = """
                    {
                        "email": "test@finflow.com",
                        "username": "us!",
                        "password": "Str0ng!Pass#2026",
                        "termsAccepted": true
                    }
                    """;

            mockMvc.perform(post("/api/v1/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(invalidUsername))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success", is(false)));

            verify(registrationService, never()).register(any());
        }
    }
}
