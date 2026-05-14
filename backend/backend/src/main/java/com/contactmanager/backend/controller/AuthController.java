package com.contactmanager.backend.controller;

import com.contactmanager.backend.dto.request.*;
import com.contactmanager.backend.dto.response.*;
import com.contactmanager.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request) {

        log.info("Register request received for username: {}",
                request.getUsername());
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(
                ApiResponse.ok("Registration successful", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {

        log.info("Login request received for identifier: {}",
                request.getIdentifier());
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(
                ApiResponse.ok("Login successful", response));
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ChangePasswordRequest request) {

        log.info("Change password request for user: {}",
                userDetails.getUsername());
        authService.changePassword(userDetails.getUsername(), request);
        return ResponseEntity.ok(
                ApiResponse.ok("Password changed successfully", null));
    }
}