package com.finflow.shared.config;

import com.finflow.shared.constants.ErrorCodes;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.AuthenticationException;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("JwtAuthenticationEntryPoint")
class JwtAuthenticationEntryPointTest {

    private JwtAuthenticationEntryPoint entryPoint;

    @Mock
    private AuthenticationException authException;

    @BeforeEach
    void setUp() {
        entryPoint = new JwtAuthenticationEntryPoint();
    }

    @Test
    @DisplayName("should return 401 with correct error response")
    void shouldReturn401WithErrorResponse() throws Exception {
        MockHttpServletResponse response = new MockHttpServletResponse();

        entryPoint.commence(null, response, authException);

        assertThat(response.getStatus()).isEqualTo(HttpServletResponse.SC_UNAUTHORIZED);
        assertThat(response.getContentType()).contains("application/json");

        String body = response.getContentAsString();
        assertThat(body).contains(ErrorCodes.UNAUTHORIZED);
        assertThat(body).contains("Authentication required");
    }
}
