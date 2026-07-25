package com.hackathon.aiguardian.service;

import com.hackathon.aiguardian.dto.AuthRequest;
import com.hackathon.aiguardian.dto.AuthResponse;
import com.hackathon.aiguardian.model.User;
import com.hackathon.aiguardian.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * AuthService
 *
 * Purpose: Handles user authentication and registration for the AI Financial Guardian.
 *
 * Responsibilities:
 * - Register new users with bcrypt-hashed passwords.
 * - Authenticate existing users, rotate session token, and initialise consent scope.
 * - Return session Bearer tokens for subsequent authenticated API calls.
 *
 * Dependencies:
 * - UserRepository
 * - ConsentScopeService (scope initialisation on login)
 * - PasswordEncoder (BCrypt)
 *
 * Security Considerations:
 * - Session token is a random UUID — rotated on every login to prevent token reuse.
 * - Password hash is BCrypt strength 12 — never stored or logged in plain text.
 * - Username enumeration is prevented by using a generic "Invalid username or password" message.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final ConsentScopeService consentScopeService;
    private final PasswordEncoder passwordEncoder;

    /**
     * Registers a new user account with a bcrypt-hashed password.
     * Issues a session token and initialises the default consent scope.
     *
     * @param request AuthRequest containing username and plain-text password
     * @return AuthResponse with generated session Bearer token
     * @throws IllegalArgumentException if the username is already registered
     */
    @Transactional
    public AuthResponse register(AuthRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new IllegalArgumentException(
                "Username '" + request.username() + "' is already registered."
            );
        }

        String token = generateSessionToken();

        User user = User.builder()
            .username(request.username())
            .password(passwordEncoder.encode(request.password()))
            .sessionToken(token)
            .build();

        User saved = userRepository.save(user);

        // Initialise default consent scope for the new session
        String sessionId = buildSessionId(saved.getUsername());
        consentScopeService.initializeScope(saved.getId(), sessionId);

        log.info("[Auth] New user registered: {}", saved.getUsername());

        return new AuthResponse(
            "SUCCESS",
            new AuthResponse.UserInfo(saved.getUsername()),
            token,
            "Account registered successfully."
        );
    }

    /**
     * Authenticates a user with username and password.
     * Rotates the session token and re-initialises the consent scope on successful login.
     *
     * @param request AuthRequest containing credentials
     * @return AuthResponse with a fresh session Bearer token
     * @throws IllegalArgumentException if credentials are invalid (generic message for security)
     */
    @Transactional
    public AuthResponse login(AuthRequest request) {
        // Use generic error message to prevent username enumeration
        final String AUTH_ERROR = "Invalid username or password.";

        User user = userRepository.findByUsername(request.username())
            .orElseThrow(() -> {
                log.warn("[Auth][Security] Failed login attempt — username not found: {}", request.username());
                return new IllegalArgumentException(AUTH_ERROR);
            });

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            log.warn("[Auth][Security] Failed login attempt — wrong password for user: {}", request.username());
            throw new IllegalArgumentException(AUTH_ERROR);
        }

        // Rotate session token on every successful login
        String newToken = generateSessionToken();
        user.setSessionToken(newToken);
        userRepository.save(user);

        // Re-initialise consent scope for the fresh session
        String sessionId = buildSessionId(user.getUsername());
        consentScopeService.initializeScope(user.getId(), sessionId);

        log.info("[Auth] User authenticated: {}", user.getUsername());

        return new AuthResponse(
            "SUCCESS",
            new AuthResponse.UserInfo(user.getUsername()),
            newToken,
            "Authentication successful."
        );
    }

    /**
     * Generates a cryptographically random, URL-safe session token.
     *
     * @return Token string in format "guardian-{uuid-without-dashes}"
     */
    private String generateSessionToken() {
        return "guardian-" + UUID.randomUUID().toString().replace("-", "");
    }

    /**
     * Builds a deterministic session ID from the username.
     * Used to tie consent scopes, audit logs, and pending actions to the same logical session.
     *
     * @param username Authenticated username
     * @return Session identifier string
     */
    public static String buildSessionId(String username) {
        return "session-" + username;
    }
}
