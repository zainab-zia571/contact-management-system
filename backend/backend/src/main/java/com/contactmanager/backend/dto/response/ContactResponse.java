package com.contactmanager.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ContactResponse {

    private Long id;
    private String firstName;
    private String lastName;
    private String title;
    private List<EmailEntry> emails;
    private List<PhoneEntry> phones;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class EmailEntry {
        private Long id;
        private String emailAddress;
        private String label;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PhoneEntry {
        private Long id;
        private String phoneNumber;
        private String label;
    }
}