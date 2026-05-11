package com.contactmanager.backend.dto.request;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank
    @Size(min = 3, max = 100)
    private String username;

    private String email;
    private String phoneNumber;

    @NotBlank
    @Size(min = 6, max = 100)
    private String password;
}