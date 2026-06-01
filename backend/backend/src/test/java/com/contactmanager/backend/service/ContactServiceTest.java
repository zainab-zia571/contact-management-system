package com.contactmanager.backend.service;

import com.contactmanager.backend.dto.request.ContactRequest;
import com.contactmanager.backend.dto.response.ContactResponse;
import com.contactmanager.backend.entity.*;
import com.contactmanager.backend.exception.BadRequestException;
import com.contactmanager.backend.exception.ResourceNotFoundException;
import com.contactmanager.backend.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ContactService Tests")
class ContactServiceTest {

    @Mock private ContactRepository contactRepository;
    @Mock private ContactEmailRepository emailRepository;
    @Mock private ContactPhoneRepository phoneRepository;
    @Mock private UserRepository userRepository;

    @InjectMocks private ContactService contactService;

    private User testUser;
    private Contact testContact;
    private ContactRequest testRequest;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .username("johndoe")
                .email("john@example.com")
                .build();

        ContactEmail email = ContactEmail.builder()
                .id(1L).emailAddress("jane@work.com").label("work").build();

        ContactPhone phone = ContactPhone.builder()
                .id(1L).phoneNumber("+1234567890").label("work").build();

        testContact = Contact.builder()
                .id(1L)
                .user(testUser)
                .firstName("Jane")
                .lastName("Smith")
                .title("Manager")
                .emails(List.of(email))
                .phones(List.of(phone))
                .build();

        ContactRequest.EmailEntry emailEntry = new ContactRequest.EmailEntry();
        emailEntry.setEmailAddress("jane@work.com");
        emailEntry.setLabel("work");

        ContactRequest.PhoneEntry phoneEntry = new ContactRequest.PhoneEntry();
        phoneEntry.setPhoneNumber("+1234567890");
        phoneEntry.setLabel("work");

        testRequest = new ContactRequest();
        testRequest.setFirstName("Jane");
        testRequest.setLastName("Smith");
        testRequest.setTitle("Manager");
        testRequest.setEmails(List.of(emailEntry));
        testRequest.setPhones(List.of(phoneEntry));
    }

    // ── GET ALL TESTS ───────────────────────────────────────

    @Test
    @DisplayName("getContacts — returns paginated contacts for user")
    void getContacts_noSearch_returnsPaginatedList() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Contact> mockPage = new PageImpl<>(List.of(testContact));

        when(contactRepository.findByUserId(1L, pageable)).thenReturn(mockPage);

        Page<ContactResponse> result = contactService.getContacts(1L, null, pageable);

        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getFirstName()).isEqualTo("Jane");
        verify(contactRepository).findByUserId(1L, pageable);
        verify(contactRepository, never()).searchByName(any(), any(), any());
    }

    @Test
    @DisplayName("getContacts — uses search query when provided")
    void getContacts_withSearch_callsSearchByName() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Contact> mockPage = new PageImpl<>(List.of(testContact));

        when(contactRepository.searchByName(1L, "jane", pageable)).thenReturn(mockPage);

        Page<ContactResponse> result = contactService.getContacts(1L, "jane", pageable);

        assertThat(result.getContent()).hasSize(1);
        verify(contactRepository).searchByName(1L, "jane", pageable);
        verify(contactRepository, never()).findByUserId(any(), any());
    }

    @Test
    @DisplayName("getContacts — returns empty page when no contacts found")
    void getContacts_noContacts_returnsEmptyPage() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Contact> emptyPage = new PageImpl<>(List.of());

        when(contactRepository.findByUserId(1L, pageable)).thenReturn(emptyPage);

        Page<ContactResponse> result = contactService.getContacts(1L, null, pageable);

        assertThat(result.getContent()).isEmpty();
    }

    // ── GET BY ID TESTS ─────────────────────────────────────

    @Test
    @DisplayName("getContactById — returns contact when owner matches")
    void getContactById_ownerMatches_returnsContact() {
        when(contactRepository.findById(1L)).thenReturn(Optional.of(testContact));

        ContactResponse result = contactService.getContactById(1L, 1L);

        assertThat(result).isNotNull();
        assertThat(result.getFirstName()).isEqualTo("Jane");
        assertThat(result.getLastName()).isEqualTo("Smith");
    }

    @Test
    @DisplayName("getContactById — throws not found when contact does not exist")
    void getContactById_notFound_throwsResourceNotFoundException() {
        when(contactRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> contactService.getContactById(99L, 1L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Contact not found");
    }

    @Test
    @DisplayName("getContactById — throws bad request when user is not owner")
    void getContactById_wrongOwner_throwsBadRequest() {
        when(contactRepository.findById(1L)).thenReturn(Optional.of(testContact));

        // user id 99 is not the owner (owner is user id 1)
        assertThatThrownBy(() -> contactService.getContactById(1L, 99L))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("permission");
    }

    // ── CREATE TESTS ────────────────────────────────────────

    @Test
    @DisplayName("createContact — saves contact and returns response")
    void createContact_validRequest_savesAndReturns() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(contactRepository.save(any(Contact.class))).thenReturn(testContact);

        ContactResponse result = contactService.createContact(1L, testRequest);

        assertThat(result).isNotNull();
        assertThat(result.getFirstName()).isEqualTo("Jane");
        assertThat(result.getLastName()).isEqualTo("Smith");
        verify(contactRepository).save(any(Contact.class));
        verify(emailRepository).saveAll(anyList());
        verify(phoneRepository).saveAll(anyList());
    }

    @Test
    @DisplayName("createContact — throws not found when user does not exist")
    void createContact_userNotFound_throwsResourceNotFoundException() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> contactService.createContact(99L, testRequest))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("User not found");

        verify(contactRepository, never()).save(any());
    }

    @Test
    @DisplayName("createContact — works when emails list is null")
    void createContact_nullEmails_doesNotThrow() {
        testRequest.setEmails(null);
        testRequest.setPhones(null);

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(contactRepository.save(any(Contact.class))).thenReturn(testContact);

        assertThatNoException().isThrownBy(
                () -> contactService.createContact(1L, testRequest));

        verify(emailRepository, never()).saveAll(any());
        verify(phoneRepository, never()).saveAll(any());
    }

    // ── UPDATE TESTS ────────────────────────────────────────

    @Test
    @DisplayName("updateContact — updates and returns updated contact")
    void updateContact_validRequest_updatesContact() {
        testRequest.setFirstName("Jane Updated");
        testRequest.setTitle("Senior Manager");

        when(contactRepository.findById(1L)).thenReturn(Optional.of(testContact));
        when(contactRepository.save(any(Contact.class))).thenReturn(testContact);

        ContactResponse result = contactService.updateContact(1L, 1L, testRequest);

        assertThat(result).isNotNull();
        verify(emailRepository).deleteByContactId(1L);
        verify(phoneRepository).deleteByContactId(1L);
        verify(contactRepository).save(any(Contact.class));
    }

    @Test
    @DisplayName("updateContact — throws not found when contact missing")
    void updateContact_contactNotFound_throwsException() {
        when(contactRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> contactService.updateContact(99L, 1L, testRequest))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("updateContact — throws bad request when wrong user tries to update")
    void updateContact_wrongUser_throwsBadRequest() {
        when(contactRepository.findById(1L)).thenReturn(Optional.of(testContact));

        assertThatThrownBy(() -> contactService.updateContact(1L, 99L, testRequest))
                .isInstanceOf(BadRequestException.class);
    }

    // ── DELETE TESTS ────────────────────────────────────────

    @Test
    @DisplayName("deleteContact — deletes contact when owner matches")
    void deleteContact_ownerMatches_deletesContact() {
        when(contactRepository.findById(1L)).thenReturn(Optional.of(testContact));
        doNothing().when(contactRepository).delete(testContact);

        assertThatNoException().isThrownBy(
                () -> contactService.deleteContact(1L, 1L));

        verify(contactRepository).delete(testContact);
    }

    @Test
    @DisplayName("deleteContact — throws not found when contact missing")
    void deleteContact_notFound_throwsException() {
        when(contactRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> contactService.deleteContact(99L, 1L))
                .isInstanceOf(ResourceNotFoundException.class);

        verify(contactRepository, never()).delete(any());
    }

    @Test
    @DisplayName("deleteContact — throws bad request when wrong user tries to delete")
    void deleteContact_wrongUser_throwsBadRequest() {
        when(contactRepository.findById(1L)).thenReturn(Optional.of(testContact));

        assertThatThrownBy(() -> contactService.deleteContact(1L, 99L))
                .isInstanceOf(BadRequestException.class);

        verify(contactRepository, never()).delete(any());
    }
}