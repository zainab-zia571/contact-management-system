package com.contactmanager.backend.entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "contact_emails")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ContactEmail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contact_id", nullable = false)
    private Contact contact;

    @Column(name = "email_address", nullable = false)
    private String emailAddress;

    @Column(nullable = false)
    private String label;
}