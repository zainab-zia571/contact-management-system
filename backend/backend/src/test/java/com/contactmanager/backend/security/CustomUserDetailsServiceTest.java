package com.contactmanager.backend.security;

import com.contactmanager.backend.entity.User;
import com.contactmanager.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("CustomUserDetailsService Tests")
class CustomUserDetailsServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CustomUserDetailsService userDetailsService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .username("johndoe")
                .email("john@example.com")
                .passwordHash("hashed_password")
                .build();
    }

    @Test
    @DisplayName("loadUserByUsername — returns UserDetails when user exists")
    void loadUserByUsername_exists_returnsUserDetails() {
        when(userRepository.findByUsername("johndoe"))
                .thenReturn(Optional.of(testUser));

        UserDetails details =
                userDetailsService.loadUserByUsername("johndoe");

        assertThat(details).isNotNull();
        assertThat(details.getUsername()).isEqualTo("johndoe");
        assertThat(details.getPassword()).isEqualTo("hashed_password");
    }

    @Test
    @DisplayName("loadUserByUsername — has USER role")
    void loadUserByUsername_exists_hasUserRole() {
        when(userRepository.findByUsername("johndoe"))
                .thenReturn(Optional.of(testUser));

        UserDetails details =
                userDetailsService.loadUserByUsername("johndoe");

        assertThat(details.getAuthorities()).isNotEmpty();
        assertThat(details.getAuthorities()
                .stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_USER")))
                .isTrue();
    }

    @Test
    @DisplayName("loadUserByUsername — throws when user not found")
    void loadUserByUsername_notFound_throwsException() {
        when(userRepository.findByUsername("ghost"))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() ->
                userDetailsService.loadUserByUsername("ghost"))
                .isInstanceOf(UsernameNotFoundException.class)
                .hasMessageContaining("ghost");
    }

    @Test
    @DisplayName("loadUserByUsername — calls repository once")
    void loadUserByUsername_callsRepositoryOnce() {
        when(userRepository.findByUsername("johndoe"))
                .thenReturn(Optional.of(testUser));

        userDetailsService.loadUserByUsername("johndoe");

        verify(userRepository, times(1)).findByUsername("johndoe");
    }
}