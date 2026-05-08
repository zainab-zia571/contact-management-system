package com.contactmanager.backend.repository;

import com.contactmanager.backend.entity.Contact;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ContactRepository extends JpaRepository<Contact, Long> {

    Page<Contact> findByUserId(Long userId, Pageable pageable);

    @Query("""
        SELECT c FROM Contact c
        WHERE c.user.id = :userId
        AND (LOWER(c.firstName) LIKE LOWER(CONCAT('%', :search, '%'))
        OR   LOWER(c.lastName)  LIKE LOWER(CONCAT('%', :search, '%')))
        """)
    Page<Contact> searchByName(@Param("userId") Long userId,
                               @Param("search") String search,
                               Pageable pageable);
}