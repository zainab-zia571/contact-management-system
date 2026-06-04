package com.contactmanager.backend.repository;

import com.contactmanager.backend.entity.ContactPhone;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ContactPhoneRepository extends JpaRepository<ContactPhone, Long> {

    @Modifying
    @Transactional
    @Query("DELETE FROM ContactPhone p WHERE p.contact.id = :contactId")
    void deleteByContactId(@Param("contactId") Long contactId);
}