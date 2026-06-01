package com.contactmanager.backend.controller;

import com.contactmanager.backend.dto.request.*;
import com.contactmanager.backend.dto.response.AuthResponse;
import com.contactmanager.backend.security.CustomUserDetailsService;
import com.contactmanager.backend.security.JwtTokenProvider;
import com.contactmanager.backend.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@DisplayName("AuthController Tests")
class AuthControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @MockitoBean private AuthService authService;
    @MockitoBean private UserDetailsService userDetailsService;
    @MockitoBean private AuthenticationManager authenticationManager;
    @MockitoBean private PasswordEncoder passwordEncoder;
    @MockitoBean private JwtTokenProvider jwtTokenProvider;
    @MockitoBean private CustomUserDetailsService customUserDetailsService;

    // ── REGISTER ────────────────────────────────────────────

    @Test
    @WithMockUser   // ✅ required for slice test context
    @DisplayName("POST /api/auth/register — returns 200 on success")
    void register_validRequest_returns200() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("johndoe");
        request.setEmail("john@example.com");
        request.setPassword("pass123");

        AuthResponse mockResponse = new AuthResponse("jwt_token", "johndoe", "john@example.com");
        when(authService.register(any(RegisterRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/auth/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Registration successful"))
                .andExpect(jsonPath("$.data.token").value("jwt_token"))
                .andExpect(jsonPath("$.data.username").value("johndoe"));
    }

    @Test
    @WithMockUser   // ✅ required for slice test context
    @DisplayName("POST /api/auth/register — returns 400 when username blank")
    void register_blankUsername_returns400() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("");
        request.setEmail("john@example.com");
        request.setPassword("pass123");

        mockMvc.perform(post("/api/auth/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());

        verify(authService, never()).register(any());
    }

    @Test
    @WithMockUser   // ✅ required for slice test context
    @DisplayName("POST /api/auth/register — returns 400 when password too short")
    void register_shortPassword_returns400() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("johndoe");
        request.setEmail("john@example.com");
        request.setPassword("12");

        mockMvc.perform(post("/api/auth/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    // ── LOGIN ───────────────────────────────────────────────

    @Test
    @WithMockUser   // ✅ required for slice test context
    @DisplayName("POST /api/auth/login — returns 200 with token on success")
    void login_validCredentials_returns200WithToken() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setIdentifier("johndoe");
        request.setPassword("pass123");

        AuthResponse mockResponse = new AuthResponse("jwt_token", "johndoe", "john@example.com");
        when(authService.login(any(LoginRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/auth/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").value("jwt_token"))
                .andExpect(jsonPath("$.data.username").value("johndoe"));
    }

    @Test
    @WithMockUser   // ✅ required for slice test context
    @DisplayName("POST /api/auth/login — returns 400 when identifier blank")
    void login_blankIdentifier_returns400() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setIdentifier("");
        request.setPassword("pass123");

        mockMvc.perform(post("/api/auth/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    // ── CHANGE PASSWORD ─────────────────────────────────────

    @Test
    @WithMockUser(username = "johndoe")
    @DisplayName("POST /api/auth/change-password — returns 200 on success")
    void changePassword_validRequest_returns200() throws Exception {
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setCurrentPassword("oldpass");
        request.setNewPassword("newpass123");

        doNothing().when(authService).changePassword(eq("johndoe"), any());

        mockMvc.perform(post("/api/auth/change-password")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Password changed successfully"));
    }
}