package com.contactmanager.backend.util;

import lombok.extern.slf4j.Slf4j;

import java.util.regex.Pattern;

@Slf4j
public class ValidationUtils {

    private ValidationUtils() {
        throw new IllegalStateException("Utility class");
    }

    // \w already includes [a-zA-Z0-9_], so no duplicates needed
    private static final String USERNAME_REGEX =
            "^(?=.*[a-zA-Z])[\\w]{3,30}$";

    // cleaned email regex (no duplicate ranges)
    private static final String EMAIL_REGEX =
            "^[\\w.+%\\-]+@[\\w.\\-]+\\.[a-zA-Z]{2,}$";

    // digit class cleaned
    private static final String PHONE_REGEX =
            "^\\+?[\\d]{7,15}$";

    private static final String NAME_REGEX =
            "^[a-zA-Z\\s'\\-]{2,50}$";

    private static final Pattern LETTER_PATTERN =
            Pattern.compile("[a-zA-Z]");

    private static final Pattern DIGIT_PATTERN =
            Pattern.compile("\\d");

    public static boolean isValidUsername(String username) {
        return username != null && username.matches(USERNAME_REGEX);
    }

    public static boolean isValidEmail(String email) {
        return email != null && email.matches(EMAIL_REGEX);
    }

    public static boolean isValidPhone(String phone) {
        if (phone == null) return false;
        String stripped = phone.trim().replace(" ", "");
        return stripped.matches(PHONE_REGEX);
    }

    public static boolean isValidName(String name) {
        return name != null && name.matches(NAME_REGEX);
    }

    public static boolean isValidPassword(String password) {
        if (password == null || password.length() < 6)
            return false;

        return LETTER_PATTERN.matcher(password).find()
                && DIGIT_PATTERN.matcher(password).find();
    }
}