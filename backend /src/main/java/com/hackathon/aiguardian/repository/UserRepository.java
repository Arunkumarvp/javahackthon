package com.hackathon.aiguardian.repository;

import com.hackathon.aiguardian.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * UserRepository
 *
 * Purpose: Spring Data JPA repository for User entity persistence operations.
 *
 * Responsibilities:
 * - Standard CRUD operations via JpaRepository.
 * - Lookup users by username for login authentication.
 * - Lookup users by session token for Bearer token validation (TokenAuthFilter).
 * - Check username uniqueness before registration.
 *
 * Dependencies:
 * - Spring Data JPA
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Finds a user by their unique username.
     *
     * @param username The username to search
     * @return Optional User entity
     */
    Optional<User> findByUsername(String username);

    /**
     * Finds a user by their active session token.
     * Used by TokenAuthFilter to authenticate incoming requests.
     *
     * @param sessionToken Bearer token value from Authorization header
     * @return Optional User entity
     */
    Optional<User> findBySessionToken(String sessionToken);

    /**
     * Checks whether a username is already registered.
     * Prevents duplicate registrations.
     *
     * @param username Username to check
     * @return true if the username already exists
     */
    boolean existsByUsername(String username);
}
