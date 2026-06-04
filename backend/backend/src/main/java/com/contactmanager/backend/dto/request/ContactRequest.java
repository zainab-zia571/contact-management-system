//package com.contactmanager.backend.dto.request;
//
//import jakarta.validation.constraints.NotBlank;
//import lombok.Data;
//import java.util.List;
//
//@Data
//public class ContactRequest {
//
//    @NotBlank
//    private String firstName;
//
//    @NotBlank
//    private String lastName;
//
//    private String title;
//
//    private List<EmailEntry> emails;
//    private List<PhoneEntry> phones;
//
//    @Data
//    public static class EmailEntry {
//        private String emailAddress;
//        private String label;
//    }
//
//    @Data
//    public static class PhoneEntry {
//        private String phoneNumber;
//        private String label;
//    }
//}

package com.contactmanager.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import java.util.List;

@Data
public class ContactRequest {

    @NotBlank(message = "First name is required")
    @Pattern(
            regexp = "^[a-zA-Z\\s'\\-]{2,50}$",
            message = "First name can only contain letters, " +
                    "spaces, hyphens and apostrophes"
    )
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Pattern(
            regexp = "^[a-zA-Z\\s'\\-]{2,50}$",
            message = "Last name can only contain letters, " +
                    "spaces, hyphens and apostrophes"
    )
    private String lastName;

    @Pattern(
            regexp = "^[a-zA-Z\\s'\\-\\.]{0,100}$",
            message = "Title can only contain letters and spaces"
    )
    private String title;

    private List<EmailEntry> emails;
    private List<PhoneEntry> phones;

    @Data
    public static class EmailEntry {

        @NotBlank(message = "Email address is required")
        @Pattern(
                regexp = "^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+" +
                        "\\.[a-zA-Z]{2,}$",
                message = "Please enter a valid email address"
        )
        private String emailAddress;

        @NotBlank(message = "Email label is required")
        private String label;
    }

    @Data
    public static class PhoneEntry {

        @NotBlank(message = "Phone number is required")
        @Pattern(
                regexp = "^\\+?[0-9]{7,15}$",
                message = "Phone number can only contain digits " +
                        "and an optional leading +. Must be 7-15 digits"
        )
        private String phoneNumber;

        @NotBlank(message = "Phone label is required")
        private String label;
    }
}