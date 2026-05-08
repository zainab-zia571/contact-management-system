package com.contactmanager.backend.repository;

import com.contactmanager.backend.entity.ContactEmail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactEmailRepository extends JpaRepository<ContactEmail, Long> {
    void deleteByContactId(Long contactId);
}