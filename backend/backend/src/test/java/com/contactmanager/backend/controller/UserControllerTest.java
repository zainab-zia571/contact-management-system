package com.contactmanager.backend.controller;

import com.contactmanager.backend.entity.User;
import com.contactmanager.backend.exception.ResourceNotFoundException;
import com.contactmanager.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("UserController Tests")
class UserControllerTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserController userController;

    private User testUser;
    private org.springframework.security.core.userdetails.UserDetails mockUserDetails;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .username("johndoe")
                .email("john@example.com")
                .phoneNumber("+1234567890")
                .passwordHash("hashed")
                .build();

        mockUserDetails =
                org.springframework.security.core.userdetails.User
                        .withUsername("johndoe")
                        .password("hashed")
                        .roles("USER")
                        .build();
    }

    @Test
    @DisplayName("getCurrentUser — returns 200 with user data")
    void getCurrentUser_found_returns200() {
        when(userRepository.findByUsername("johndoe"))
                .thenReturn(Optional.of(testUser));

        var response = userController.getCurrentUser(mockUserDetails);

        assertThat(response.getStatusCode())
                .isEqualTo(HttpStatus.OK);

        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().isSuccess()).isTrue();

        assertThat(response.getBody().getMessage())
                .isEqualTo("User fetched successfully");

        assertThat(response.getBody().getData()).isNotNull();

        assertThat(response.getBody().getData().getUsername())
                .isEqualTo("johndoe");

        assertThat(response.getBody().getData().getEmail())
                .isEqualTo("john@example.com");
    }

    @Test
    @DisplayName("getCurrentUser — returns phone number in response")
    void getCurrentUser_found_returnsPhoneNumber() {
        when(userRepository.findByUsername("johndoe"))
                .thenReturn(Optional.of(testUser));

        var response = userController.getCurrentUser(mockUserDetails);

        assertThat(response.getBody().getData().getPhoneNumber())
                .isEqualTo("+1234567890");
    }

    @Test
    @DisplayName("getCurrentUser — throws ResourceNotFoundException when not found")
    void getCurrentUser_notFound_throwsException() {

        org.springframework.security.core.userdetails.UserDetails ghost =
                org.springframework.security.core.userdetails.User
                        .withUsername("ghost")
                        .password("pass")
                        .roles("USER")
                        .build();

        when(userRepository.findByUsername("ghost"))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() ->
                userController.getCurrentUser(ghost))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("User not found");
    }

    @Test
    @DisplayName("getCurrentUser — calls repository with correct username")
    void getCurrentUser_callsRepositoryWithCorrectUsername() {
        when(userRepository.findByUsername("johndoe"))
                .thenReturn(Optional.of(testUser));

        userController.getCurrentUser(mockUserDetails);

        verify(userRepository, times(1))
                .findByUsername("johndoe");
    }

    @Test
    @DisplayName("getCurrentUser — response data has correct id")
    void getCurrentUser_responseHasCorrectId() {
        when(userRepository.findByUsername("johndoe"))
                .thenReturn(Optional.of(testUser));

        var response = userController.getCurrentUser(mockUserDetails);

        assertThat(response.getBody().getData().getId())
                .isEqualTo(1L);
    }
}