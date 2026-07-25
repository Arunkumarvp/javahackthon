package com.hackathon.aiguardian.controller;

import com.hackathon.aiguardian.dto.AuthRequest;
import com.hackathon.aiguardian.dto.AuthResponse;
import com.hackathon.aiguardian.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * AuthController
 *
 * Purpose: REST controller handling user authentication (login and registration).
 *
 * Responsibilities:
 * - Accept login and registration requests without authentication (public endpoints).
 * - Delegate credential validation and token issuance to AuthService.
 * - Return session Bearer tokens to the frontend for subsequent authenticated calls.
 *
 * Endpoints:
 * - POST /api/auth/login    — Authenticate existing user
 * - POST /api/auth/register — Register new user account
 *
 * Dependencies:
 * - AuthService
 *
 * Design Principles:
 * - Thin controller: zero business logic, only request/response orchestration.
 * - All validation handled by @Valid + GlobalExceptionHandler.
 */
@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * Authenticates a user with username and password.
     * Returns a Bearer token on success.
     *
     * @param request Login credentials
     * @return HTTP 200 with AuthResponse containing token
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        log.info("[AuthController] Login attempt for username: {}", request.username());
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Registers a new user account.
     * Returns a Bearer token immediately upon successful registration.
     *
     * @param request Registration credentials
     * @return HTTP 201 CREATED with AuthResponse containing token
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody AuthRequest request) {
        log.info("[AuthController] Registration request for username: {}", request.username());
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
