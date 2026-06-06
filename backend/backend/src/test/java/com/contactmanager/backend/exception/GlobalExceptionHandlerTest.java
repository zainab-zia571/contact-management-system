package com.contactmanager.backend.exception;

import com.contactmanager.backend.dto.response.ApiResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.List;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("GlobalExceptionHandler Tests")
class GlobalExceptionHandlerTest {

    @InjectMocks
    private GlobalExceptionHandler handler;

    // ── ResourceNotFoundException ────────────────────────

    @Test
    @DisplayName("handleNotFound — returns 404 with message")
    void handleNotFound_returns404() {
        ResourceNotFoundException ex =
                new ResourceNotFoundException("Contact not found");

        ResponseEntity<ApiResponse<Void>> response =
                handler.handleNotFound(ex);

        assertThat(response.getStatusCode())
                .isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage())
                .isEqualTo("Contact not found");
        assertThat(response.getBody().isSuccess()).isFalse();
    }

    // ── BadRequestException ──────────────────────────────

    @Test
    @DisplayName("handleBadRequest — returns 400 with message")
    void handleBadRequest_returns400() {
        BadRequestException ex =
                new BadRequestException("Invalid credentials");

        ResponseEntity<ApiResponse<Void>> response =
                handler.handleBadRequest(ex);

        assertThat(response.getStatusCode())
                .isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage())
                .isEqualTo("Invalid credentials");
        assertThat(response.getBody().isSuccess()).isFalse();
    }

    // ── MethodArgumentNotValidException ──────────────────

    @Test
    @DisplayName("handleValidation — returns 400 with field errors")
    void handleValidation_returns400WithErrors() {
        MethodArgumentNotValidException ex =
                mock(MethodArgumentNotValidException.class);
        BindingResult bindingResult = mock(BindingResult.class);
        FieldError fieldError =
                new FieldError("obj", "email", "must not be blank");

        when(ex.getBindingResult()).thenReturn(bindingResult);
        when(bindingResult.getFieldErrors())
                .thenReturn(List.of(fieldError));

        ResponseEntity<ApiResponse<Void>> response =
                handler.handleValidation(ex);

        assertThat(response.getStatusCode())
                .isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage())
                .contains("email")
                .contains("must not be blank");
    }

    // ── DataIntegrityViolationException ──────────────────

    @Test
    @DisplayName("handleDataIntegrity — email message")
    void handleDataIntegrity_emailConstraint_returns400() {
        DataIntegrityViolationException ex =
                new DataIntegrityViolationException(
                        "unique constraint ix_users_email violated");

        ResponseEntity<ApiResponse<Void>> response =
                handler.handleDataIntegrity(ex);

        assertThat(response.getStatusCode())
                .isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
    }

    @Test
    @DisplayName("handleDataIntegrity — phone message")
    void handleDataIntegrity_phoneConstraint_returns400() {
        DataIntegrityViolationException ex =
                new DataIntegrityViolationException(
                        "unique constraint on phone_number violated");

        ResponseEntity<ApiResponse<Void>> response =
                handler.handleDataIntegrity(ex);

        assertThat(response.getStatusCode())
                .isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    @DisplayName("handleDataIntegrity — username message")
    void handleDataIntegrity_usernameConstraint_returns400() {
        DataIntegrityViolationException ex =
                new DataIntegrityViolationException(
                        "unique constraint on username violated");

        ResponseEntity<ApiResponse<Void>> response =
                handler.handleDataIntegrity(ex);

        assertThat(response.getStatusCode())
                .isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody().getMessage())
                .contains("username");
    }

    @Test
    @DisplayName("handleDataIntegrity — check constraint message")
    void handleDataIntegrity_checkConstraint_returns400() {
        DataIntegrityViolationException ex =
                new DataIntegrityViolationException(
                        "chk_email_or_phone check constraint failed");

        ResponseEntity<ApiResponse<Void>> response =
                handler.handleDataIntegrity(ex);

        assertThat(response.getStatusCode())
                .isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody().getMessage())
                .contains("email or phone");
    }

    // ── General Exception ────────────────────────────────

    @Test
    @DisplayName("handleGeneral — returns 500")
    void handleGeneral_returns500() {
        Exception ex = new Exception("Unexpected error");

        ResponseEntity<ApiResponse<Void>> response =
                handler.handleGeneral(ex);

        assertThat(response.getStatusCode())
                .isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().isSuccess()).isFalse();
    }
}