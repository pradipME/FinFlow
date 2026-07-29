package com.finflow.shared.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("JwtAuthenticationFilter")
class JwtAuthenticationFilterTest {

    private JwtAuthenticationFilter filter;
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private HttpServletRequest request;
    @Mock
    private HttpServletResponse response;
    @Mock
    private FilterChain filterChain;

    @BeforeEach
    void setUp() {
        String secret = "Y2hva2Vja2V5Zm9yZmluZmxvd2JhY2tlbmRzZWN1cml0eXN0b3JlZ2VuZXJhdGlvbjEyMzQ1Njc4";
        JwtProperties props = new JwtProperties(secret, 900_000L, "finflow", "finflow-api",
                30_000L, Map.of("primary", secret), "primary");
        JwtSigningKeyProvider keyProvider = new JwtSigningKeyProvider(props);
        jwtTokenProvider = new JwtTokenProvider(props, keyProvider);
        filter = new JwtAuthenticationFilter(jwtTokenProvider);
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("should set authentication when valid token provided")
    void shouldSetAuthenticationWhenValidToken() throws ServletException, IOException {
        String token = jwtTokenProvider.generateAccessToken(
                "user-123", "test@example.com", List.of("CUSTOMER"), List.of("read"));

        when(request.getHeader("Authorization")).thenReturn("Bearer " + token);

        filter.doFilterInternal(request, response, filterChain);

        verify(filterChain).doFilter(request, response);

        var auth = SecurityContextHolder.getContext().getAuthentication();
        org.junit.jupiter.api.Assertions.assertNotNull(auth, "Authentication should not be null");
        org.junit.jupiter.api.Assertions.assertEquals("user-123", auth.getName());
        org.junit.jupiter.api.Assertions.assertTrue(auth.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_CUSTOMER")));
        org.junit.jupiter.api.Assertions.assertTrue(auth.getAuthorities().contains(new SimpleGrantedAuthority("read")));
    }

    @Test
    @DisplayName("should not set authentication when no token provided")
    void shouldNotSetAuthenticationWhenNoToken() throws ServletException, IOException {
        when(request.getHeader("Authorization")).thenReturn(null);

        filter.doFilterInternal(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        assert SecurityContextHolder.getContext().getAuthentication() == null;
    }

    @Test
    @DisplayName("should not set authentication when invalid token")
    void shouldNotSetAuthenticationWhenInvalidToken() throws ServletException, IOException {
        when(request.getHeader("Authorization")).thenReturn("Bearer invalid-token");

        filter.doFilterInternal(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        assert SecurityContextHolder.getContext().getAuthentication() == null;
    }

    @Test
    @DisplayName("should not set authentication when token throws exception")
    void shouldNotSetAuthenticationWhenTokenThrowsException() throws ServletException, IOException {
        when(request.getHeader("Authorization")).thenReturn("Bearer bad.token.here");

        filter.doFilterInternal(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        assert SecurityContextHolder.getContext().getAuthentication() == null;
    }

    @Test
    @DisplayName("should not override existing authentication")
    void shouldNotOverrideExistingAuthentication() throws ServletException, IOException {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("existing", null, List.of())
        );

        String token = jwtTokenProvider.generateAccessToken(
                "user-123", "test@example.com", List.of("CUSTOMER"), List.of());
        when(request.getHeader("Authorization")).thenReturn("Bearer " + token);

        filter.doFilterInternal(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        assert SecurityContextHolder.getContext().getAuthentication().getName().equals("existing");
    }

    @Test
    @DisplayName("should handle empty bearer token")
    void shouldHandleEmptyBearerToken() throws ServletException, IOException {
        when(request.getHeader("Authorization")).thenReturn("Bearer ");

        filter.doFilterInternal(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        assert SecurityContextHolder.getContext().getAuthentication() == null;
    }
}
