package com.contactmanager.backend.util;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.*;

class ValidationUtilsTest {

    // ───────────────────────── USERNAME ─────────────────────────

    @Test
    void isValidUsername_valid_returnsTrue() {
        assertThat(ValidationUtils.isValidUsername("john_doe123")).isTrue();
    }

    @Test
    void isValidUsername_invalid_returnsFalse() {
        assertThat(ValidationUtils.isValidUsername("!!")).isFalse();
    }

    @Test
    void isValidUsername_null_returnsFalse() {
        assertThat(ValidationUtils.isValidUsername(null)).isFalse();
    }

    // ───────────────────────── EMAIL ─────────────────────────

    @Test
    void isValidEmail_valid_returnsTrue() {
        assertThat(ValidationUtils.isValidEmail("test@gmail.com")).isTrue();
    }

    @Test
    void isValidEmail_invalid_returnsFalse() {
        assertThat(ValidationUtils.isValidEmail("test@")).isFalse();
    }

    @Test
    void isValidEmail_null_returnsFalse() {
        assertThat(ValidationUtils.isValidEmail(null)).isFalse();
    }

    // ───────────────────────── PHONE ─────────────────────────

    @Test
    void isValidPhone_valid_returnsTrue() {
        assertThat(ValidationUtils.isValidPhone("+923001234567")).isTrue();
    }

    @Test
    void isValidPhone_invalid_returnsFalse() {
        assertThat(ValidationUtils.isValidPhone("abc123")).isFalse();
    }

    @Test
    void isValidPhone_null_returnsFalse() {
        assertThat(ValidationUtils.isValidPhone(null)).isFalse();
    }

    // ───────────────────────── NAME ─────────────────────────

    @Test
    void isValidName_valid_returnsTrue() {
        assertThat(ValidationUtils.isValidName("John Doe")).isTrue();
    }

    @Test
    void isValidName_invalid_returnsFalse() {
        assertThat(ValidationUtils.isValidName("1")).isFalse();
    }

    @Test
    void isValidName_null_returnsFalse() {
        assertThat(ValidationUtils.isValidName(null)).isFalse();
    }

    // ───────────────────────── PASSWORD ─────────────────────────

    @Test
    void isValidPassword_valid_returnsTrue() {
        assertThat(ValidationUtils.isValidPassword("abc123")).isTrue();
    }

    @Test
    void isValidPassword_tooShort_returnsFalse() {
        assertThat(ValidationUtils.isValidPassword("a1")).isFalse();
    }

    @Test
    void isValidPassword_noDigit_returnsFalse() {
        assertThat(ValidationUtils.isValidPassword("abcdef")).isFalse();
    }

    @Test
    void isValidPassword_noLetter_returnsFalse() {
        assertThat(ValidationUtils.isValidPassword("123456")).isFalse();
    }

    @Test
    void isValidPassword_null_returnsFalse() {
        assertThat(ValidationUtils.isValidPassword(null)).isFalse();
    }
}