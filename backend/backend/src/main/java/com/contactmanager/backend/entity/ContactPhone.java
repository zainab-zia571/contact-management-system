package com.contactmanager.backend.entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "contact_phones")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ContactPhone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contact_id", nullable = false)
    private Contact contact;

    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @Column(nullable = false)
    private String label;
}