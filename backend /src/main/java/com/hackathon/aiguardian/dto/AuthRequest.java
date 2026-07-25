package com.hackathon.aiguardian.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * AuthRequest
 *
 * Purpose: DTO carrying user credentials for login and registration requests.
 *
 * Responsibilities:
 * - Transport username and password from the client to AuthController.
 * - Enforce validation constraints to prevent empty or oversized inputs.
 *
 * Design: Immutable Java record for clean, thread-safe data transport.
 */
public record AuthRequest(

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    String username,

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters")
    String password

) {}
