package com.contactmanager.backend.service;

import com.contactmanager.backend.dto.request.ChangePasswordRequest;
import com.contactmanager.backend.dto.request.LoginRequest;
import com.contactmanager.backend.dto.request.RegisterRequest;
import com.contactmanager.backend.dto.response.AuthResponse;
import com.contactmanager.backend.entity.User;
import com.contactmanager.backend.exception.BadRequestException;
import com.contactmanager.backend.exception.ResourceNotFoundException;
import com.contactmanager.backend.repository.UserRepository;
import com.contactmanager.backend.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService Tests")
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtTokenProvider jwtTokenProvider;

    @InjectMocks private AuthService authService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .username("johndoe")
                .email("john@example.com")
                .phoneNumber("+1234567890")
                .passwordHash("hashed_password")
                .build();
    }

    // ── REGISTER TESTS ──────────────────────────────────────

    @Test
    @DisplayName("register — success with email")
    void register_withEmail_success() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("johndoe");
        request.setEmail("john@example.com");
        request.setPassword("pass123");

        when(userRepository.existsByUsername("johndoe")).thenReturn(false);
        when(userRepository.existsByEmail("john@example.com")).thenReturn(false);
        when(passwordEncoder.encode("pass123")).thenReturn("hashed_password");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtTokenProvider.generateToken("johndoe")).thenReturn("jwt_token");

        AuthResponse response = authService.register(request);

        assertThat(response).isNotNull();
        assertThat(response.getToken()).isEqualTo("jwt_token");
        assertThat(response.getUsername()).isEqualTo("johndoe");
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("register — success with phone number")
    void register_withPhone_success() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("janedoe");
        request.setPhoneNumber("+1234567890");
        request.setPassword("pass123");

        when(userRepository.existsByUsername("janedoe")).thenReturn(false);
        when(userRepository.existsByPhoneNumber("+1234567890")).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("hashed");
        when(userRepository.save(any())).thenReturn(testUser);
        when(jwtTokenProvider.generateToken(any())).thenReturn("token");

        AuthResponse response = authService.register(request);

        assertThat(response).isNotNull();
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("register — fails when no email or phone provided")
    void register_noEmailOrPhone_throwsBadRequest() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("johndoe");
        request.setPassword("pass123");
        // no email, no phone

        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining(
                        "Please provide at least one of email or phone number");

        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("register — fails when username already taken")
    void register_usernameTaken_throwsBadRequest() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("johndoe");
        request.setEmail("new@example.com");
        request.setPassword("pass123");

        when(userRepository.existsByUsername("johndoe")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Username already taken");

        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("register — fails when email already registered")
    void register_emailTaken_throwsBadRequest() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("newuser");
        request.setEmail("john@example.com");
        request.setPassword("pass123");

        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("john@example.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Email already registered");
    }

    // ── LOGIN TESTS ─────────────────────────────────────────

    @Test
    @DisplayName("login — success with username")
    void login_withUsername_success() {
        LoginRequest request = new LoginRequest();
        request.setIdentifier("johndoe");
        request.setPassword("pass123");

        when(userRepository.findByUsername("johndoe")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("pass123", "hashed_password")).thenReturn(true);
        when(jwtTokenProvider.generateToken("johndoe")).thenReturn("jwt_token");

        AuthResponse response = authService.login(request);

        assertThat(response.getToken()).isEqualTo("jwt_token");
        assertThat(response.getUsername()).isEqualTo("johndoe");
    }

    @Test
    @DisplayName("login — success with email")
    void login_withEmail_success() {
        LoginRequest request = new LoginRequest();
        request.setIdentifier("john@example.com");
        request.setPassword("pass123");

        when(userRepository.findByUsername("john@example.com")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("pass123", "hashed_password")).thenReturn(true);
        when(jwtTokenProvider.generateToken("johndoe")).thenReturn("jwt_token");

        AuthResponse response = authService.login(request);

        assertThat(response).isNotNull();
        assertThat(response.getToken()).isEqualTo("jwt_token");
    }

    @Test
    @DisplayName("login — success with phone number")
    void login_withPhone_success() {
        LoginRequest request = new LoginRequest();
        request.setIdentifier("+1234567890");
        request.setPassword("pass123");

        when(userRepository.findByUsername("+1234567890")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("+1234567890")).thenReturn(Optional.empty());
        when(userRepository.findByPhoneNumber("+1234567890")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("pass123", "hashed_password")).thenReturn(true);
        when(jwtTokenProvider.generateToken("johndoe")).thenReturn("jwt_token");

        AuthResponse response = authService.login(request);

        assertThat(response).isNotNull();
    }

    @Test
    @DisplayName("login — fails when user not found")
    void login_userNotFound_throwsBadRequest() {
        LoginRequest request = new LoginRequest();
        request.setIdentifier("nobody");
        request.setPassword("pass123");

        when(userRepository.findByUsername("nobody")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("nobody")).thenReturn(Optional.empty());
        when(userRepository.findByPhoneNumber("nobody")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Invalid credentials");
    }

    @Test
    @DisplayName("login — fails when password is wrong")
    void login_wrongPassword_throwsBadRequest() {
        LoginRequest request = new LoginRequest();
        request.setIdentifier("johndoe");
        request.setPassword("wrongpassword");

        when(userRepository.findByUsername("johndoe")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrongpassword", "hashed_password")).thenReturn(false);

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Invalid credentials");
    }

    // ── CHANGE PASSWORD TESTS ───────────────────────────────

    @Test
    @DisplayName("changePassword — success")
    void changePassword_success() {
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setCurrentPassword("oldpass");
        request.setNewPassword("newpass123");

        when(userRepository.findByUsername("johndoe")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("oldpass", "hashed_password")).thenReturn(true);
        when(passwordEncoder.encode("newpass123")).thenReturn("new_hashed");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        assertThatNoException().isThrownBy(
                () -> authService.changePassword("johndoe", request));

        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("changePassword — fails when current password is wrong")
    void changePassword_wrongCurrent_throwsBadRequest() {
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setCurrentPassword("wrongpass");
        request.setNewPassword("newpass123");

        when(userRepository.findByUsername("johndoe")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrongpass", "hashed_password")).thenReturn(false);

        assertThatThrownBy(() -> authService.changePassword("johndoe", request))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Current password is incorrect");

        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("changePassword — fails when user not found")
    void changePassword_userNotFound_throwsNotFound() {
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setCurrentPassword("oldpass");
        request.setNewPassword("newpass");

        when(userRepository.findByUsername("ghost")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.changePassword("ghost", request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("User not found");
    }
}