package com.finflow.modules.auth.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.finflow.modules.auth.dto.AuthenticationResult;
import com.finflow.modules.auth.dto.LoginRequest;
import com.finflow.modules.auth.service.AuthenticationService;
import com.finflow.shared.dto.ApiResponse;
import com.finflow.shared.exception.BusinessRuleException;
import com.finflow.shared.exception.GlobalExceptionHandler;
import com.finflow.shared.exception.UnauthorizedException;
import com.finflow.shared.exception.ValidationException;
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
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthController — Login Endpoint")
class AuthControllerLoginTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @Mock
    private AuthenticationService authenticationService;

    @Mock
    private com.finflow.modules.auth.service.RegistrationService registrationService;

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
    @DisplayName("POST /api/v1/auth/login")
    class LoginEndpoint {

        private LoginRequest validRequest;
        private AuthenticationResult successResult;

        @BeforeEach
        void setUp() {
            validRequest = new LoginRequest("test@finflow.com", "Str0ng!Pass#2026");
            successResult = new AuthenticationResult(
                    UUID.randomUUID(),
                    "test@finflow.com",
                    "testuser",
                    "ACTIVE",
                    List.of("CUSTOMER"),
                    LocalDateTime.now(),
                    LocalDateTime.now().minusDays(1)
            );
        }

        @Test
        @DisplayName("should return 200 with authentication result on success")
        void shouldReturn200OnSuccess() throws Exception {
            when(authenticationService.authenticate(any(LoginRequest.class), anyString(), anyString()))
                    .thenReturn(successResult);

            mockMvc.perform(post("/api/v1/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(validRequest)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data.email", is("test@finflow.com")))
                    .andExpect(jsonPath("$.data.username", is("testuser")))
                    .andExpect(jsonPath("$.data.status", is("ACTIVE")))
                    .andExpect(jsonPath("$.data.roles", hasItem("CUSTOMER")))
                    .andExpect(jsonPath("$.meta.message", is("Authentication successful")));

            verify(authenticationService).authenticate(any(LoginRequest.class), anyString(), anyString());
        }

        @Test
        @DisplayName("should return 401 when credentials are invalid")
        void shouldReturn401WhenInvalidCredentials() throws Exception {
            when(authenticationService.authenticate(any(LoginRequest.class), anyString(), anyString()))
                    .thenThrow(new UnauthorizedException("Email or password is incorrect"));

            mockMvc.perform(post("/api/v1/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(validRequest)))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.success", is(false)))
                    .andExpect(jsonPath("$.error.code", is("UNAUTHORIZED")));
        }

        @Test
        @DisplayName("should return 400 when account is locked")
        void shouldReturn400WhenAccountLocked() throws Exception {
            when(authenticationService.authenticate(any(LoginRequest.class), anyString(), anyString()))
                    .thenThrow(new BusinessRuleException("ACCOUNT_LOCKED",
                            "Account is locked due to too many failed login attempts"));

            mockMvc.perform(post("/api/v1/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(validRequest)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success", is(false)))
                    .andExpect(jsonPath("$.error.code", is("ACCOUNT_LOCKED")));
        }

        @Test
        @DisplayName("should return 400 when identifier is missing")
        void shouldReturn400WhenIdentifierMissing() throws Exception {
            String invalidRequest = """
                    {
                        "password": "Str0ng!Pass#2026"
                    }
                    """;

            mockMvc.perform(post("/api/v1/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(invalidRequest))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success", is(false)));

            verify(authenticationService, never()).authenticate(any(), anyString(), anyString());
        }

        @Test
        @DisplayName("should return 400 when password is missing")
        void shouldReturn400WhenPasswordMissing() throws Exception {
            String invalidRequest = """
                    {
                        "identifier": "test@finflow.com"
                    }
                    """;

            mockMvc.perform(post("/api/v1/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(invalidRequest))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success", is(false)));

            verify(authenticationService, never()).authenticate(any(), anyString(), anyString());
        }

        @Test
        @DisplayName("should return 400 when both fields are empty")
        void shouldReturn400WhenBothEmpty() throws Exception {
            String invalidRequest = """
                    {
                        "identifier": "",
                        "password": ""
                    }
                    """;

            mockMvc.perform(post("/api/v1/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(invalidRequest))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success", is(false)));
        }

        @Test
        @DisplayName("should extract client IP from X-Forwarded-For header")
        void shouldExtractIpFromForwardedHeader() throws Exception {
            when(authenticationService.authenticate(any(LoginRequest.class), anyString(), anyString()))
                    .thenReturn(successResult);

            mockMvc.perform(post("/api/v1/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(validRequest))
                            .header("X-Forwarded-For", "203.0.113.1, 70.41.3.18"))
                    .andExpect(status().isOk());

            ArgumentCaptor<String> ipCaptor = ArgumentCaptor.forClass(String.class);
            verify(authenticationService).authenticate(any(), ipCaptor.capture(), anyString());
            assertThat(ipCaptor.getValue()).isEqualTo("203.0.113.1");
        }

        @Test
        @DisplayName("should extract User-Agent header")
        void shouldExtractUserAgent() throws Exception {
            when(authenticationService.authenticate(any(LoginRequest.class), anyString(), anyString()))
                    .thenReturn(successResult);

            mockMvc.perform(post("/api/v1/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(validRequest))
                            .header("User-Agent", "FinFlow-Android/1.0"))
                    .andExpect(status().isOk());

            ArgumentCaptor<String> uaCaptor = ArgumentCaptor.forClass(String.class);
            verify(authenticationService).authenticate(any(), anyString(), uaCaptor.capture());
            assertThat(uaCaptor.getValue()).isEqualTo("FinFlow-Android/1.0");
        }
    }
}
