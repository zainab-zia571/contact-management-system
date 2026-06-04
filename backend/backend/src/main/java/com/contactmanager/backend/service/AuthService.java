//package com.contactmanager.backend.service;
//
//import com.contactmanager.backend.dto.request.*;
//import com.contactmanager.backend.dto.response.AuthResponse;
//import com.contactmanager.backend.entity.User;
//import com.contactmanager.backend.exception.BadRequestException;
//import com.contactmanager.backend.exception.ResourceNotFoundException;
//import com.contactmanager.backend.repository.UserRepository;
//import com.contactmanager.backend.security.JwtTokenProvider;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//
//@Slf4j
//@Service
//@RequiredArgsConstructor
//public class AuthService {
//
//    private final UserRepository userRepository;
//    private final PasswordEncoder passwordEncoder;
//    private final JwtTokenProvider jwtTokenProvider;
//
//    public AuthResponse register(RegisterRequest request) {
//
//        // ── trim all incoming values ─────────────────────────────
//        String username = (request.getUsername() != null)
//                ? request.getUsername().trim() : null;
//
//        String email = (request.getEmail() != null
//                && !request.getEmail().isBlank())
//                ? request.getEmail().trim().toLowerCase() : null;
//
//        String phoneNumber = (request.getPhoneNumber() != null
//                && !request.getPhoneNumber().isBlank())
//                ? request.getPhoneNumber().trim() : null;
//
//        log.info("Register — username='{}' email='{}' phone='{}'",
//                username, email, phoneNumber);
//
//        // ── validate username ────────────────────────────────────
//        if (username == null || username.isBlank()) {
//            throw new BadRequestException("Username is required");
//        }
//
//        // ── must have at least email OR phone ────────────────────
//        if (email == null && phoneNumber == null) {
//            throw new BadRequestException(
//                    "Please provide at least one of email or phone number");
//        }
//
//        // ── validate email format if email was provided ──────────
//        if (email != null) {
//            String regex =
//                    "^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$";
//            if (!email.matches(regex)) {
//                throw new BadRequestException(
//                        "Please enter a valid email address (e.g. john@gmail.com)");
//            }
//        }
//
//        // ── check username uniqueness ────────────────────────────
//        if (userRepository.existsByUsername(username)) {
//            throw new BadRequestException("Username already taken");
//        }
//
//        // ── check email uniqueness — ONLY when email is provided ─
//        if (email != null) {
//            log.info("Checking email uniqueness for: '{}'", email);
//            if (userRepository.existsByEmail(email)) {
//                throw new BadRequestException("Email already registered");
//            }
//        }
//
//        // ── check phone uniqueness — ONLY when phone is provided ─
//        if (phoneNumber != null) {
//            log.info("Checking phone uniqueness for: '{}'", phoneNumber);
//            if (userRepository.existsByPhoneNumber(phoneNumber)) {
//                throw new BadRequestException(
//                        "Phone number already registered");
//            }
//        }
//
//        // ── build and save ───────────────────────────────────────
//        User user = User.builder()
//                .username(username)
//                .email(email)
//                .phoneNumber(phoneNumber)
//                .passwordHash(passwordEncoder.encode(request.getPassword()))
//                .build();
//
//        userRepository.save(user);
//        log.info("User registered: username='{}' email='{}' phone='{}'",
//                user.getUsername(), user.getEmail(), user.getPhoneNumber());
//
//        String token = jwtTokenProvider.generateToken(user.getUsername());
//        return new AuthResponse(token, user.getUsername(), user.getEmail());
//    }
//
//    public AuthResponse login(LoginRequest request) {
//
//        // find user by username, email, or phone
//        User user = userRepository
//                .findByUsername(request.getIdentifier())
//                .or(() -> userRepository.findByEmail(request.getIdentifier()))
//                .or(() -> userRepository.findByPhoneNumber(
//                        request.getIdentifier()))
//                .orElseThrow(() -> {
//                    log.warn("Login failed - user not found: {}",
//                            request.getIdentifier());
//                    return new BadRequestException("Invalid credentials");
//                });
//
//        // verify password
//        if (!passwordEncoder.matches(
//                request.getPassword(), user.getPasswordHash())) {
//            log.warn("Login failed - wrong password for user: {}",
//                    user.getUsername());
//            throw new BadRequestException("Invalid credentials");
//        }
//
//        log.info("User logged in successfully: {}", user.getUsername());
//        String token = jwtTokenProvider.generateToken(user.getUsername());
//        return new AuthResponse(token, user.getUsername(), user.getEmail());
//    }
//
//    public void changePassword(String username,
//                               ChangePasswordRequest request) {
//
//        User user = userRepository.findByUsername(username)
//                .orElseThrow(() ->
//                        new ResourceNotFoundException("User not found"));
//
//        // verify current password
//        if (!passwordEncoder.matches(
//                request.getCurrentPassword(), user.getPasswordHash())) {
//            throw new BadRequestException("Current password is incorrect");
//        }
//
//        user.setPasswordHash(
//                passwordEncoder.encode(request.getNewPassword()));
//        userRepository.save(user);
//        log.info("Password changed successfully for user: {}", username);
//    }
//}

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

        String username = request.getUsername() != null ? request.getUsername().trim() : null;
        String email = (request.getEmail() != null && !request.getEmail().isBlank())
                ? request.getEmail().trim().toLowerCase() : null;
        String phoneNumber = (request.getPhoneNumber() != null && !request.getPhoneNumber().isBlank())
                ? request.getPhoneNumber().trim() : null;

        log.info("Register — username='{}' email='{}' phone='{}'", username, email, phoneNumber);

        if (username == null || username.isBlank()) {
            throw new BadRequestException("Username is required");
        }

        if (email == null && phoneNumber == null) {
            throw new BadRequestException("Please provide at least one of email or phone number");
        }

        if (email != null && !email.matches("^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$")) {
            throw new BadRequestException("Please enter a valid email address");
        }

        if (userRepository.existsByUsername(username)) {
            throw new BadRequestException("Username already taken");
        }

        // 🔥 KEY FIX: Use the safe methods only when value is not null
        if (email != null && userRepository.existsByEmailIgnoreNull(email)) {
            throw new BadRequestException("Email already registered");
        }

        if (phoneNumber != null && userRepository.existsByPhoneNumberIgnoreNull(phoneNumber)) {
            throw new BadRequestException("Phone number already registered");
        }

        User user = User.builder()
                .username(username)
                .email(email)
                .phoneNumber(phoneNumber)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .build();

        userRepository.save(user);
        log.info("User registered: username='{}' email='{}' phone='{}'",
                user.getUsername(), user.getEmail(), user.getPhoneNumber());

        String token = jwtTokenProvider.generateToken(user.getUsername());
        return new AuthResponse(token, user.getUsername(), user.getEmail());
    }

    // login and changePassword methods remain exactly as you have them
    public AuthResponse login(LoginRequest request) {
        User user = userRepository
                .findByUsername(request.getIdentifier())
                .or(() -> userRepository.findByEmail(request.getIdentifier()))
                .or(() -> userRepository.findByPhoneNumber(request.getIdentifier()))
                .orElseThrow(() -> {
                    log.warn("Login failed - user not found: {}", request.getIdentifier());
                    return new BadRequestException("Invalid credentials");
                });

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            log.warn("Login failed - wrong password for user: {}", user.getUsername());
            throw new BadRequestException("Invalid credentials");
        }

        log.info("User logged in successfully: {}", user.getUsername());
        String token = jwtTokenProvider.generateToken(user.getUsername());
        return new AuthResponse(token, user.getUsername(), user.getEmail());
    }

    public void changePassword(String username, ChangePasswordRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Current password is incorrect");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        log.info("Password changed successfully for user: {}", username);
    }
}