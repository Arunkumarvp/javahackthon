package com.hackathon.aiguardian.exception;

/**
 * ScopeDeniedException
 *
 * Purpose: Thrown when an AI operation attempts to access data or perform an action
 *          that falls outside the user's granted consent scope.
 *
 * Responsibilities:
 * - Signal consent scope violations to GlobalExceptionHandler for a consistent 403 response.
 * - Carry a meaningful message for the JSON error response body.
 *
 * Design: Unchecked RuntimeException to avoid forcing checked exception propagation
 *         through the service layer.
 *
 * Security Considerations:
 * - Messages should be informative about which permission was denied,
 *   but must not expose internal system structure.
 */
public class ScopeDeniedException extends RuntimeException {

    public ScopeDeniedException(String message) {
        super(message);
    }

    public ScopeDeniedException(String message, Throwable cause) {
        super(message, cause);
    }
}
