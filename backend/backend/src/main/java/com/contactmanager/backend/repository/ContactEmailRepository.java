package com.contactmanager.backend.repository;

import com.contactmanager.backend.entity.ContactEmail;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ContactEmailRepository extends JpaRepository<ContactEmail, Long> {

    @Modifying
    @Transactional
    @Query("DELETE FROM ContactEmail e WHERE e.contact.id = :contactId")
    void deleteByContactId(@Param("contactId") Long contactId);
}