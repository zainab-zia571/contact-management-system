package com.contactmanager.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.List;

@Data
public class ContactRequest {

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    private String title;

    private List<EmailEntry> emails;
    private List<PhoneEntry> phones;

    @Data
    public static class EmailEntry {
        private String emailAddress;
        private String label;
    }

    @Data
    public static class PhoneEntry {
        private String phoneNumber;
        private String label;
    }
}