package com.contactmanager.backend.service;

import com.contactmanager.backend.dto.request.ContactRequest;
import com.contactmanager.backend.dto.response.ContactResponse;
import com.contactmanager.backend.entity.*;
import com.contactmanager.backend.exception.*;
import com.contactmanager.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository contactRepository;
    private final ContactEmailRepository emailRepository;
    private final ContactPhoneRepository phoneRepository;
    private final UserRepository userRepository;

    // ── GET ALL with search and pagination ──────────────────
    public Page<ContactResponse> getContacts(Long userId,
                                             String search,
                                             Pageable pageable) {
        log.info("Fetching contacts for user {} | search: '{}'",
                userId, search);

        Page<Contact> contacts;

        if (search != null && !search.isBlank()) {
            contacts = contactRepository.searchByName(
                    userId, search, pageable);
        } else {
            contacts = contactRepository.findByUserId(userId, pageable);
        }

        return contacts.map(this::toResponse);
    }

    // ── GET ONE ─────────────────────────────────────────────
    public ContactResponse getContactById(Long contactId, Long userId) {
        Contact contact = findContactAndVerifyOwner(contactId, userId);
        log.info("Fetched contact {} for user {}", contactId, userId);
        return toResponse(contact);
    }

    // ── CREATE ──────────────────────────────────────────────
    @Transactional
    public ContactResponse createContact(Long userId,
                                         ContactRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        Contact contact = Contact.builder()
                .user(user)
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .title(request.getTitle())
                .build();

        contactRepository.save(contact);
        saveEmailsAndPhones(contact, request);

        log.info("Contact created: {} {} for user {}",
                request.getFirstName(), request.getLastName(), userId);

        return toResponse(contact);
    }

    // ── UPDATE ──────────────────────────────────────────────
    @Transactional
    public ContactResponse updateContact(Long contactId,
                                         Long userId,
                                         ContactRequest request) {
        Contact contact = findContactAndVerifyOwner(contactId, userId);

        contact.setFirstName(request.getFirstName());
        contact.setLastName(request.getLastName());
        contact.setTitle(request.getTitle());

        // delete old emails and phones then save new ones
        emailRepository.deleteByContactId(contactId);
        phoneRepository.deleteByContactId(contactId);

        // flush so deleted records are gone before saving new ones
        emailRepository.flush();
        phoneRepository.flush();

        // clear stale collections from the in-memory entity
        contact.getEmails().clear();
        contact.getPhones().clear();

        contactRepository.save(contact);

        // save the new emails and phones
        saveEmailsAndPhones(contact, request);

        // reload fresh from DB so toResponse reflects actual saved data
        Contact updated = contactRepository.findById(contactId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Contact not found"));

        log.info("Contact {} updated by user {}", contactId, userId);

        return toResponse(updated);
    }

    // ── DELETE ──────────────────────────────────────────────
    @Transactional
    public void deleteContact(Long contactId, Long userId) {
        Contact contact = findContactAndVerifyOwner(contactId, userId);
        contactRepository.delete(contact);
        log.info("Contact {} deleted by user {}", contactId, userId);
    }

    // ── HELPERS ─────────────────────────────────────────────

    private Contact findContactAndVerifyOwner(Long contactId, Long userId) {
        Contact contact = contactRepository.findById(contactId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Contact not found with id: " + contactId));

        if (!contact.getUser().getId().equals(userId)) {
            log.warn("User {} tried to access contact {} owned by {}",
                    userId, contactId, contact.getUser().getId());
            throw new BadRequestException(
                    "You do not have permission to access this contact");
        }

        return contact;
    }

    private void saveEmailsAndPhones(Contact contact,
                                     ContactRequest request) {
        if (request.getEmails() != null) {
            List<ContactEmail> emails = request.getEmails().stream()
                    .map(e -> ContactEmail.builder()
                            .contact(contact)
                            .emailAddress(e.getEmailAddress())
                            .label(e.getLabel() != null
                                    ? e.getLabel() : "personal")
                            .build())
                    .toList();
            emailRepository.saveAll(emails);
        }

        if (request.getPhones() != null) {
            List<ContactPhone> phones = request.getPhones().stream()
                    .map(p -> ContactPhone.builder()
                            .contact(contact)
                            .phoneNumber(p.getPhoneNumber())
                            .label(p.getLabel() != null
                                    ? p.getLabel() : "mobile")
                            .build())
                    .toList();
            phoneRepository.saveAll(phones);
        }
    }

    // ── MAPPER: Entity → Response DTO ───────────────────────
    private ContactResponse toResponse(Contact contact) {
        List<ContactResponse.EmailEntry> emails =
                contact.getEmails() != null
                        ? contact.getEmails().stream()
                          .map(e -> new ContactResponse.EmailEntry(
                                  e.getId(),
                                  e.getEmailAddress(),
                                  e.getLabel()))
                          .toList()
                        : Collections.emptyList();

        List<ContactResponse.PhoneEntry> phones =
                contact.getPhones() != null
                        ? contact.getPhones().stream()
                          .map(p -> new ContactResponse.PhoneEntry(
                                  p.getId(),
                                  p.getPhoneNumber(),
                                  p.getLabel()))
                          .toList()
                        : Collections.emptyList();

        return new ContactResponse(
                contact.getId(),
                contact.getFirstName(),
                contact.getLastName(),
                contact.getTitle(),
                emails,
                phones,
                contact.getCreatedAt(),
                contact.getUpdatedAt()
        );
    }
}

