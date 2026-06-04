//package com.contactmanager.backend.repository;
//
//import com.contactmanager.backend.entity.User;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
//
//import java.util.Optional;
//
//public interface UserRepository extends JpaRepository<User, Long> {
//
//    Optional<User> findByUsername(String username);
//
//    Optional<User> findByEmail(String email);
//
//    Optional<User> findByPhoneNumber(String phoneNumber);
//
//    boolean existsByUsername(String username);
//
//    boolean existsByPhoneNumber(String phoneNumber);
//
//    // safe query — never matches null or empty email
//    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END " +
//            "FROM User u " +
//            "WHERE u.email IS NOT NULL " +
//            "AND u.email != '' " +
//            "AND LOWER(TRIM(u.email)) = LOWER(TRIM(:email))")
//    boolean existsByEmail(@Param("email") String email);
//}


package com.contactmanager.backend.repository;

import com.contactmanager.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findByPhoneNumber(String phoneNumber);

    boolean existsByUsername(String username);

    // These are auto-implemented by Spring Data JPA – they are safe with null
    // (WHERE email = NULL returns no rows, so multiple NULLs are not considered duplicates)
    boolean existsByEmail(String email);
    boolean existsByPhoneNumber(String phoneNumber);

    // ✅ Custom safe methods that explicitly ignore NULL values (extra safety for your service)
    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END " +
            "FROM User u " +
            "WHERE u.email IS NOT NULL " +
            "AND LOWER(TRIM(u.email)) = LOWER(TRIM(:email))")
    boolean existsByEmailIgnoreNull(@Param("email") String email);

    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END " +
            "FROM User u " +
            "WHERE u.phoneNumber IS NOT NULL " +
            "AND TRIM(u.phoneNumber) = TRIM(:phoneNumber)")
    boolean existsByPhoneNumberIgnoreNull(@Param("phoneNumber") String phoneNumber);
}