package com.contactmanager.backend.repository;

import com.contactmanager.backend.entity.ContactPhone;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactPhoneRepository extends JpaRepository<ContactPhone, Long> {
    void deleteByContactId(Long contactId);
}