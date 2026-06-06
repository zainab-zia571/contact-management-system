package com.contactmanager.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;


import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("JwtAuthenticationFilter Tests")
class JwtAuthenticationFilterTest {

    @Mock private JwtTokenProvider jwtTokenProvider;
    @Mock private CustomUserDetailsService userDetailsService;
    @Mock private HttpServletRequest request;
    @Mock private HttpServletResponse response;
    @Mock private FilterChain filterChain;

    @InjectMocks
    private JwtAuthenticationFilter filter;

    @BeforeEach
    void setUp() {
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("doFilterInternal — sets auth when token is valid")
    void doFilter_validToken_setsAuthentication() throws Exception {
        UserDetails mockUser = org.springframework.security.core.userdetails
                .User.withUsername("johndoe")
                .password("pass")
                .roles("USER")
                .build();

        when(request.getHeader("Authorization"))
                .thenReturn("Bearer valid.jwt.token");
        when(jwtTokenProvider.validateToken("valid.jwt.token"))
                .thenReturn(true);
        when(jwtTokenProvider.getUsernameFromToken("valid.jwt.token"))
                .thenReturn("johndoe");
        when(userDetailsService.loadUserByUsername("johndoe"))
                .thenReturn(mockUser);

        filter.doFilterInternal(request, response, filterChain);

        assertThat(SecurityContextHolder.getContext()
                .getAuthentication()).isNotNull();
        assertThat(SecurityContextHolder.getContext()
                .getAuthentication().getName()).isEqualTo("johndoe");
        verify(filterChain).doFilter(request, response);
    }

    @Test
    @DisplayName("doFilterInternal — skips auth when no Authorization header")
    void doFilter_noHeader_skipsAuth() throws Exception {
        when(request.getHeader("Authorization")).thenReturn(null);

        filter.doFilterInternal(request, response, filterChain);

        assertThat(SecurityContextHolder.getContext()
                .getAuthentication()).isNull();
        verify(filterChain).doFilter(request, response);
        verify(jwtTokenProvider, never()).validateToken(any());
    }

    @Test
    @DisplayName("doFilterInternal — skips auth when token is invalid")
    void doFilter_invalidToken_skipsAuth() throws Exception {
        when(request.getHeader("Authorization"))
                .thenReturn("Bearer bad.token.here");
        when(jwtTokenProvider.validateToken("bad.token.here"))
                .thenReturn(false);

        filter.doFilterInternal(request, response, filterChain);

        assertThat(SecurityContextHolder.getContext()
                .getAuthentication()).isNull();
        verify(filterChain).doFilter(request, response);
    }

    @Test
    @DisplayName("doFilterInternal — skips when header does not start with Bearer")
    void doFilter_nonBearerHeader_skipsAuth() throws Exception {
        when(request.getHeader("Authorization"))
                .thenReturn("Basic sometoken");

        filter.doFilterInternal(request, response, filterChain);

        assertThat(SecurityContextHolder.getContext()
                .getAuthentication()).isNull();
        verify(jwtTokenProvider, never()).validateToken(any());
        verify(filterChain).doFilter(request, response);
    }

    @Test
    @DisplayName("doFilterInternal — always calls filterChain.doFilter")
    void doFilter_alwaysCallsChain() throws Exception {
        when(request.getHeader("Authorization")).thenReturn(null);

        filter.doFilterInternal(request, response, filterChain);

        verify(filterChain, times(1)).doFilter(request, response);
    }
}