package com.contactmanager.backend.repository;

import com.contactmanager.backend.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
@DisplayName("UserRepository Tests")
class UserRepositoryTest {

    @Autowired private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();

        User user = User.builder()
                .username("johndoe")
                .email("john@example.com")
                .phoneNumber("+1234567890")
                .passwordHash("hashed_password")
                .build();

        userRepository.save(user);
    }

    @Test
    @DisplayName("findByUsername — returns user when exists")
    void findByUsername_exists_returnsUser() {
        Optional<User> result = userRepository.findByUsername("johndoe");

        assertThat(result).isPresent();
        assertThat(result.get().getEmail()).isEqualTo("john@example.com");
    }

    @Test
    @DisplayName("findByUsername — returns empty when not found")
    void findByUsername_notExists_returnsEmpty() {
        Optional<User> result = userRepository.findByUsername("nobody");
        assertThat(result).isEmpty();
    }

    @Test
    @DisplayName("findByEmail — returns user when email exists")
    void findByEmail_exists_returnsUser() {
        Optional<User> result = userRepository.findByEmail("john@example.com");

        assertThat(result).isPresent();
        assertThat(result.get().getUsername()).isEqualTo("johndoe");
    }

    @Test
    @DisplayName("findByPhoneNumber — returns user when phone exists")
    void findByPhoneNumber_exists_returnsUser() {
        Optional<User> result = userRepository.findByPhoneNumber("+1234567890");

        assertThat(result).isPresent();
        assertThat(result.get().getUsername()).isEqualTo("johndoe");
    }

    @Test
    @DisplayName("existsByUsername — returns true when username taken")
    void existsByUsername_taken_returnsTrue() {
        assertThat(userRepository.existsByUsername("johndoe")).isTrue();
    }

    @Test
    @DisplayName("existsByUsername — returns false when username free")
    void existsByUsername_free_returnsFalse() {
        assertThat(userRepository.existsByUsername("newuser")).isFalse();
    }

    @Test
    @DisplayName("existsByEmail — returns true when email taken")
    void existsByEmail_taken_returnsTrue() {
        assertThat(userRepository.existsByEmail("john@example.com")).isTrue();
    }

    @Test
    @DisplayName("existsByEmail — returns false when email free")
    void existsByEmail_free_returnsFalse() {
        assertThat(userRepository.existsByEmail("free@example.com")).isFalse();
    }

    @Test
    @DisplayName("existsByPhoneNumber — returns true when phone taken")
    void existsByPhoneNumber_taken_returnsTrue() {
        assertThat(userRepository.existsByPhoneNumber("+1234567890")).isTrue();
    }

    @Test
    @DisplayName("save — persists user with all fields")
    void save_validUser_persistsCorrectly() {
        User newUser = User.builder()
                .username("janedoe")
                .email("jane@example.com")
                .passwordHash("hash")
                .build();

        User saved = userRepository.save(newUser);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getUsername()).isEqualTo("janedoe");
    }
}