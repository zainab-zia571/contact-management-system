package com.contactmanager.backend.controller;

import com.contactmanager.backend.dto.request.ContactRequest;
import com.contactmanager.backend.dto.response.ContactResponse;
import com.contactmanager.backend.entity.User;
import com.contactmanager.backend.repository.UserRepository;
import com.contactmanager.backend.security.CustomUserDetailsService;
import com.contactmanager.backend.security.JwtTokenProvider;
import com.contactmanager.backend.service.ContactService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.data.domain.*;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ContactController.class)
@DisplayName("ContactController Tests")
class ContactControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @MockitoBean private ContactService contactService;
    @MockitoBean private UserRepository userRepository;
    @MockitoBean private UserDetailsService userDetailsService;
    @MockitoBean private AuthenticationManager authenticationManager;
    @MockitoBean private PasswordEncoder passwordEncoder;
    @MockitoBean private JwtTokenProvider jwtTokenProvider;
    @MockitoBean private CustomUserDetailsService customUserDetailsService;   // <-- added

    private User testUser;
    private ContactResponse testResponse;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L).username("johndoe").email("john@example.com").build();

        testResponse = new ContactResponse();
        testResponse.setId(1L);
        testResponse.setFirstName("Jane");
        testResponse.setLastName("Smith");
        testResponse.setTitle("Manager");
        testResponse.setEmails(List.of(
                new ContactResponse.EmailEntry(1L, "jane@work.com", "work")));
        testResponse.setPhones(List.of(
                new ContactResponse.PhoneEntry(1L, "+1234567890", "work")));

        when(userRepository.findByUsername("johndoe")).thenReturn(Optional.of(testUser));
    }

    // ── GET ALL ─────────────────────────────────────────────

    @Test
    @WithMockUser(username = "johndoe")
    @DisplayName("GET /api/contacts — returns paginated list")
    void getContacts_authenticated_returnsList() throws Exception {
        Page<ContactResponse> page = new PageImpl<>(List.of(testResponse));
        when(contactService.getContacts(eq(1L), isNull(), any(Pageable.class)))
                .thenReturn(page);

        mockMvc.perform(get("/api/contacts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content[0].firstName").value("Jane"))
                .andExpect(jsonPath("$.data.content[0].lastName").value("Smith"));
    }

    @Test
    @DisplayName("GET /api/contacts — returns 401 when not authenticated")
    void getContacts_notAuthenticated_returns401() throws Exception {
        mockMvc.perform(get("/api/contacts"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "johndoe")
    @DisplayName("GET /api/contacts?search=jane — calls search method")
    void getContacts_withSearch_callsSearchMethod() throws Exception {
        Page<ContactResponse> page = new PageImpl<>(List.of(testResponse));
        when(contactService.getContacts(eq(1L), eq("jane"), any(Pageable.class)))
                .thenReturn(page);

        mockMvc.perform(get("/api/contacts").param("search", "jane"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content[0].firstName").value("Jane"));
    }

    // ── GET ONE ─────────────────────────────────────────────

    @Test
    @WithMockUser(username = "johndoe")
    @DisplayName("GET /api/contacts/{id} — returns single contact")
    void getContact_validId_returnsContact() throws Exception {
        when(contactService.getContactById(1L, 1L)).thenReturn(testResponse);

        mockMvc.perform(get("/api/contacts/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.firstName").value("Jane"))
                .andExpect(jsonPath("$.data.emails[0].label").value("work"));
    }

    // ── CREATE ──────────────────────────────────────────────

    @Test
    @WithMockUser(username = "johndoe")
    @DisplayName("POST /api/contacts — creates and returns contact")
    void createContact_validRequest_returns200() throws Exception {
        ContactRequest request = new ContactRequest();
        request.setFirstName("Jane");
        request.setLastName("Smith");
        request.setTitle("Manager");

        when(contactService.createContact(eq(1L), any(ContactRequest.class)))
                .thenReturn(testResponse);

        mockMvc.perform(post("/api/contacts")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.firstName").value("Jane"))
                .andExpect(jsonPath("$.message").value("Contact created successfully"));
    }

    @Test
    @WithMockUser(username = "johndoe")
    @DisplayName("POST /api/contacts — returns 400 when firstName blank")
    void createContact_blankFirstName_returns400() throws Exception {
        ContactRequest request = new ContactRequest();
        request.setFirstName("");
        request.setLastName("Smith");

        mockMvc.perform(post("/api/contacts")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());

        verify(contactService, never()).createContact(any(), any());
    }

    // ── UPDATE ──────────────────────────────────────────────

    @Test
    @WithMockUser(username = "johndoe")
    @DisplayName("PUT /api/contacts/{id} — updates and returns contact")
    void updateContact_validRequest_returns200() throws Exception {
        ContactRequest request = new ContactRequest();
        request.setFirstName("Jane");
        request.setLastName("Smith Updated");

        when(contactService.updateContact(eq(1L), eq(1L), any(ContactRequest.class)))
                .thenReturn(testResponse);

        mockMvc.perform(put("/api/contacts/1")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Contact updated successfully"));
    }

    // ── DELETE ──────────────────────────────────────────────

    @Test
    @WithMockUser(username = "johndoe")
    @DisplayName("DELETE /api/contacts/{id} — deletes contact")
    void deleteContact_validId_returns200() throws Exception {
        doNothing().when(contactService).deleteContact(1L, 1L);

        mockMvc.perform(delete("/api/contacts/1").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Contact deleted successfully"));

        verify(contactService).deleteContact(1L, 1L);
    }
}