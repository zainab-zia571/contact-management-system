package com.contactmanager.backend.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("JwtTokenProvider Tests")
class JwtTokenProviderTest {

    private JwtTokenProvider jwtTokenProvider;

    private static final String SECRET =
            "TestSecretKeyForJWTTokenMustBe32CharsLong!!";

    private static final long EXPIRATION = 86400000L;

    @BeforeEach
    void setUp() {
        jwtTokenProvider = new JwtTokenProvider();
        ReflectionTestUtils.setField(jwtTokenProvider, "jwtSecret", SECRET);
        ReflectionTestUtils.setField(jwtTokenProvider, "jwtExpirationMs", EXPIRATION);
    }

    @Test
    void generateToken_returnsNonNull() {
        String token = jwtTokenProvider.generateToken("johndoe");
        assertThat(token).isNotNull().isNotBlank();
    }

    @Test
    void generateToken_hasThreeParts() {
        String token = jwtTokenProvider.generateToken("johndoe");
        assertThat(token.split("\\.")).hasSize(3);
    }

    @Test
    void getUsernameFromToken_returnsUsername() {
        String token = jwtTokenProvider.generateToken("johndoe");
        assertThat(jwtTokenProvider.getUsernameFromToken(token))
                .isEqualTo("johndoe");
    }

    @Test
    void validateToken_validToken_returnsTrue() {
        String token = jwtTokenProvider.generateToken("johndoe");
        assertThat(jwtTokenProvider.validateToken(token)).isTrue();
    }

    @Test
    void validateToken_invalidToken_returnsFalse() {
        assertThat(jwtTokenProvider.validateToken("invalid.token.here"))
                .isFalse();
    }

    @Test
    void validateToken_emptyToken_returnsFalse() {
        assertThat(jwtTokenProvider.validateToken("")).isFalse();
    }

    @Test
    void validateToken_nullToken_returnsFalse() {
        assertThat(jwtTokenProvider.validateToken(null)).isFalse();
    }

    @Test
    void validateToken_expiredToken_returnsFalse() {

        // make token expire immediately
        ReflectionTestUtils.setField(jwtTokenProvider, "jwtExpirationMs", -1L);

        String token = jwtTokenProvider.generateToken("johndoe");

        assertThat(jwtTokenProvider.validateToken(token)).isFalse();
    }

    @Test
    void validateToken_malformedToken_returnsFalse() {
        assertThat(jwtTokenProvider.validateToken("notajwt")).isFalse();
    }

    @Test
    void generateToken_differentUsers_differentTokens() {
        String token1 = jwtTokenProvider.generateToken("user1");
        String token2 = jwtTokenProvider.generateToken("user2");
        assertThat(token1).isNotEqualTo(token2);
    }
}