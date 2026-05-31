package com.contactmanager.backend.controller;

import com.contactmanager.backend.dto.request.ContactRequest;
import com.contactmanager.backend.dto.response.ApiResponse;
import com.contactmanager.backend.dto.response.ContactResponse;
import com.contactmanager.backend.repository.UserRepository;
import com.contactmanager.backend.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/contacts")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;
    private final UserRepository userRepository;

    private Long getUserId(UserDetails userDetails) {
        log.debug("Resolving user ID for username: {}", userDetails.getUsername());
        return userRepository
                .findByUsername(userDetails.getUsername())
                .orElseThrow(() -> {
                    log.error("User not found: {}", userDetails.getUsername());
                    return new RuntimeException("User not found");
                })
                .getId();
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ContactResponse>>> getContacts(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Long userId = getUserId(userDetails);
        log.info("Fetching contacts for user ID {} - page={}, size={}, search='{}'", userId, page, size, search);

        Pageable pageable = PageRequest.of(page, size, Sort.by("lastName").ascending());
        Page<ContactResponse> contacts = contactService.getContacts(userId, search, pageable);

        log.debug("Returned {} contacts for user ID {}", contacts.getNumberOfElements(), userId);
        return ResponseEntity.ok(ApiResponse.ok("Contacts fetched successfully", contacts));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ContactResponse>> getContact(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {

        Long userId = getUserId(userDetails);
        log.info("Fetching contact ID {} for user ID {}", id, userId);

        ContactResponse contact = contactService.getContactById(id, userId);
        return ResponseEntity.ok(ApiResponse.ok("Contact fetched successfully", contact));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ContactResponse>> createContact(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ContactRequest request) {

        Long userId = getUserId(userDetails);
        log.info("Creating new contact for user ID {} with data: {}", userId, request);

        ContactResponse contact = contactService.createContact(userId, request);
        log.info("Contact created successfully with ID {} for user ID {}", contact.getId(), userId);

        return ResponseEntity.ok(ApiResponse.ok("Contact created successfully", contact));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ContactResponse>> updateContact(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody ContactRequest request) {

        Long userId = getUserId(userDetails);
        log.info("Updating contact ID {} for user ID {} with data: {}", id, userId, request);

        ContactResponse contact = contactService.updateContact(id, userId, request);
        log.info("Contact ID {} updated successfully for user ID {}", id, userId);

        return ResponseEntity.ok(ApiResponse.ok("Contact updated successfully", contact));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteContact(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {

        Long userId = getUserId(userDetails);
        log.info("Deleting contact ID {} for user ID {}", id, userId);

        contactService.deleteContact(id, userId);
        log.warn("Contact ID {} deleted by user ID {}", id, userId);  // use WARN for destructive actions

        return ResponseEntity.ok(ApiResponse.ok("Contact deleted successfully", null));
    }
}