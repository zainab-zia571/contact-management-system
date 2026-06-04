package com.contactmanager.backend.util;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class ValidationUtils {

    private static final String USERNAME_REGEX =
            "^(?=.*[a-zA-Z])[a-zA-Z0-9_]{3,30}$";

    private static final String EMAIL_REGEX =
            "^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$";

    private static final String PHONE_REGEX =
            "^\\+?[0-9]{7,15}$";

    private static final String NAME_REGEX =
            "^[a-zA-Z\\s'\\-]{2,50}$";

    public static boolean isValidUsername(String username) {
        return username != null
                && username.matches(USERNAME_REGEX);
    }

    public static boolean isValidEmail(String email) {
        return email != null
                && email.matches(EMAIL_REGEX);
    }

    public static boolean isValidPhone(String phone) {
        if (phone == null) return false;
        String stripped = phone.trim().replace(" ", "");
        return stripped.matches(PHONE_REGEX);
    }

    public static boolean isValidName(String name) {
        return name != null
                && name.matches(NAME_REGEX);
    }

    public static boolean isValidPassword(String password) {
        if (password == null || password.length() < 6)
            return false;
        boolean hasLetter = password.matches(".*[a-zA-Z].*");
        boolean hasDigit  = password.matches(".*[0-9].*");
        return hasLetter && hasDigit;
    }
}