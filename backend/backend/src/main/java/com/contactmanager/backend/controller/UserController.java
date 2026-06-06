package com.contactmanager.backend.controller;

import com.contactmanager.backend.dto.response.ApiResponse;
import com.contactmanager.backend.exception.ResourceNotFoundException;
import com.contactmanager.backend.repository.UserRepository;
import com.contactmanager.backend.dto.response.UserResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(
            @AuthenticationPrincipal UserDetails userDetails) {

        log.info("Fetching profile for user: {}", userDetails.getUsername());

        return userRepository.findByUsername(userDetails.getUsername())
                .map(user -> {
                    UserResponse response = new UserResponse(
                            user.getId(),
                            user.getUsername(),
                            user.getEmail(),
                            user.getPhoneNumber()
                    );
                    return ResponseEntity.ok(
                            ApiResponse.ok("User fetched successfully", response));
                })
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));
    }
}