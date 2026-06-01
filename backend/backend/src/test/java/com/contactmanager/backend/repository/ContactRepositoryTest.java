package com.contactmanager.backend.repository;

import com.contactmanager.backend.entity.Contact;
import com.contactmanager.backend.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.*;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
@DisplayName("ContactRepository Tests")
class ContactRepositoryTest {

    @Autowired private ContactRepository contactRepository;
    @Autowired private UserRepository userRepository;

    private User testUser;

    @BeforeEach
    void setUp() {
        contactRepository.deleteAll();
        userRepository.deleteAll();

        testUser = userRepository.save(User.builder()
                .username("johndoe")
                .email("john@example.com")
                .passwordHash("hash")
                .build());

        contactRepository.save(Contact.builder()
                .user(testUser).firstName("Jane").lastName("Smith").title("Manager").build());
        contactRepository.save(Contact.builder()
                .user(testUser).firstName("John").lastName("Brown").title("Developer").build());
        contactRepository.save(Contact.builder()
                .user(testUser).firstName("Alice").lastName("Johnson").title("Designer").build());
    }

    @Test
    @DisplayName("findByUserId — returns all contacts for user")
    void findByUserId_returnsAllContacts() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Contact> result = contactRepository.findByUserId(testUser.getId(), pageable);

        assertThat(result.getContent()).hasSize(3);
    }

    @Test
    @DisplayName("findByUserId — returns empty when user has no contacts")
    void findByUserId_noContacts_returnsEmpty() {
        User emptyUser = userRepository.save(User.builder()
                .username("emptyuser")
                .email("empty@example.com")
                .passwordHash("hash")
                .build());

        Page<Contact> result = contactRepository.findByUserId(
                emptyUser.getId(), PageRequest.of(0, 10));

        assertThat(result.getContent()).isEmpty();
    }

    @Test
    @DisplayName("findByUserId — respects pagination size")
    void findByUserId_pagination_respectsPageSize() {
        Pageable pageable = PageRequest.of(0, 2);
        Page<Contact> result = contactRepository.findByUserId(testUser.getId(), pageable);

        assertThat(result.getContent()).hasSize(2);
        assertThat(result.getTotalElements()).isEqualTo(3);
        assertThat(result.getTotalPages()).isEqualTo(2);
    }

    @Test
    @DisplayName("searchByName — finds by first name partial match")
    void searchByName_byFirstName_returnsMatch() {
        Page<Contact> result = contactRepository.searchByName(
                testUser.getId(), "jan", PageRequest.of(0, 10));

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getFirstName()).isEqualTo("Jane");
    }

    @Test
    @DisplayName("searchByName — finds by last name partial match")
    void searchByName_byLastName_returnsMatch() {
        Page<Contact> result = contactRepository.searchByName(
                testUser.getId(), "brow", PageRequest.of(0, 10));

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getLastName()).isEqualTo("Brown");
    }

    @Test
    @DisplayName("searchByName — is case insensitive")
    void searchByName_caseInsensitive_returnsMatch() {
        Page<Contact> result = contactRepository.searchByName(
                testUser.getId(), "JANE", PageRequest.of(0, 10));

        assertThat(result.getContent()).hasSize(1);
    }

    @Test
    @DisplayName("searchByName — returns empty when no match")
    void searchByName_noMatch_returnsEmpty() {
        Page<Contact> result = contactRepository.searchByName(
                testUser.getId(), "xyz_no_match", PageRequest.of(0, 10));

        assertThat(result.getContent()).isEmpty();
    }

    @Test
    @DisplayName("searchByName — does not return contacts from other users")
    void searchByName_otherUser_returnsEmpty() {
        Page<Contact> result = contactRepository.searchByName(
                999L, "jane", PageRequest.of(0, 10));

        assertThat(result.getContent()).isEmpty();
    }
}