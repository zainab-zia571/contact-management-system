package com.contactmanager.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank
    private String identifier;  // accepts username, email, or phone

    @NotBlank
    private String password;
}