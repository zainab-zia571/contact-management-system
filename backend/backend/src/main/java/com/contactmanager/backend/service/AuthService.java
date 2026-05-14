package com.contactmanager.backend.service;

import com.contactmanager.backend.dto.request.*;
import com.contactmanager.backend.dto.response.AuthResponse;
import com.contactmanager.backend.entity.User;
import com.contactmanager.backend.exception.BadRequestException;
import com.contactmanager.backend.exception.ResourceNotFoundException;
import com.contactmanager.backend.repository.UserRepository;
import com.contactmanager.backend.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthResponse register(RegisterRequest request) {

        // validate at least email or phone is provided
        if (request.getEmail() == null && request.getPhoneNumber() == null) {
            throw new BadRequestException(
                    "Email or phone number is required");
        }

        // check username not already taken
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username already taken");
        }

        // check email not already registered
        if (request.getEmail() != null &&
                userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }

        // check phone not already registered
        if (request.getPhoneNumber() != null &&
                userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new BadRequestException("Phone number already registered");
        }

        // build and save user
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .build();

        userRepository.save(user);
        log.info("New user registered: {}", user.getUsername());

        String token = jwtTokenProvider.generateToken(user.getUsername());
        return new AuthResponse(token, user.getUsername(), user.getEmail());
    }

    public AuthResponse login(LoginRequest request) {

        // find user by username, email, or phone
        User user = userRepository
                .findByUsername(request.getIdentifier())
                .or(() -> userRepository.findByEmail(request.getIdentifier()))
                .or(() -> userRepository.findByPhoneNumber(
                        request.getIdentifier()))
                .orElseThrow(() -> {
                    log.warn("Login failed - user not found: {}",
                            request.getIdentifier());
                    return new BadRequestException("Invalid credentials");
                });

        // verify password
        if (!passwordEncoder.matches(
                request.getPassword(), user.getPasswordHash())) {
            log.warn("Login failed - wrong password for user: {}",
                    user.getUsername());
            throw new BadRequestException("Invalid credentials");
        }

        log.info("User logged in successfully: {}", user.getUsername());
        String token = jwtTokenProvider.generateToken(user.getUsername());
        return new AuthResponse(token, user.getUsername(), user.getEmail());
    }

    public void changePassword(String username,
                               ChangePasswordRequest request) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        // verify current password
        if (!passwordEncoder.matches(
                request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Current password is incorrect");
        }

        user.setPasswordHash(
                passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        log.info("Password changed successfully for user: {}", username);
    }
}