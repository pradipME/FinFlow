package com.finflow.shared.config;

import com.finflow.shared.constants.ErrorCodes;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.access.AccessDeniedException;

import static org.assertj.core.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("JwtAccessDeniedHandler")
class JwtAccessDeniedHandlerTest {

    private JwtAccessDeniedHandler accessDeniedHandler;

    @Mock
    private AccessDeniedException accessDeniedException;

    @BeforeEach
    void setUp() {
        accessDeniedHandler = new JwtAccessDeniedHandler();
    }

    @Test
    @DisplayName("should return 403 with correct error response")
    void shouldReturn403WithErrorResponse() throws Exception {
        MockHttpServletResponse response = new MockHttpServletResponse();

        accessDeniedHandler.handle(null, response, accessDeniedException);

        assertThat(response.getStatus()).isEqualTo(HttpServletResponse.SC_FORBIDDEN);
        assertThat(response.getContentType()).contains("application/json");

        String body = response.getContentAsString();
        assertThat(body).contains(ErrorCodes.FORBIDDEN);
        assertThat(body).contains("Insufficient permissions");
    }
}
