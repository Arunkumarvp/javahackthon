package com.hackathon.aiguardian.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * GlobalExceptionHandler
 *
 * Purpose: Centralised exception handler for all AI Financial Guardian REST API endpoints.
 *
 * Responsibilities:
 * - Translate application exceptions into consistent JSON error responses.
 * - Prevent sensitive internal stack traces from leaking to API clients.
 * - Log all errors with appropriate severity for operational observability.
 *
 * Dependencies:
 * - Spring MVC @RestControllerAdvice
 *
 * Error response format:
 * {
 *   "error": "ERROR_CODE",
 *   "message": "Human-readable message",
 *   "timestamp": "2026-07-25T10:30:00"
 * }
 *
 * Security Considerations:
 * - Generic exceptions return a vague message to prevent information disclosure.
 * - Full exception details are only written to server-side logs, never to the response body.
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handles consent scope denial — returns HTTP 403 FORBIDDEN.
     *
     * @param ex ScopeDeniedException thrown by ConsentScopeService
     * @return 403 JSON error response
     */
    @ExceptionHandler(ScopeDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleScopeDenied(ScopeDeniedException ex) {
        log.warn("[Security] Consent scope denial: {}", ex.getMessage());
        return buildErrorResponse("SCOPE_DENIED", ex.getMessage(), HttpStatus.FORBIDDEN);
    }

    /**
     * Handles Bean Validation failures (@Valid) — returns HTTP 400 BAD_REQUEST
     * with a concatenated list of field validation messages.
     *
     * @param ex MethodArgumentNotValidException from validation failure
     * @return 400 JSON error response
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationError(MethodArgumentNotValidException ex) {
        String fieldErrors = ex.getBindingResult().getFieldErrors()
            .stream()
            .map(FieldError::getDefaultMessage)
            .collect(Collectors.joining("; "));

        log.warn("[Validation] Request validation failed: {}", fieldErrors);
        return buildErrorResponse("VALIDATION_ERROR", fieldErrors, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handles illegal argument exceptions — returns HTTP 400 BAD_REQUEST.
     *
     * @param ex IllegalArgumentException from service layer input checks
     * @return 400 JSON error response
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgument(IllegalArgumentException ex) {
        log.warn("[API] Invalid request argument: {}", ex.getMessage());
        return buildErrorResponse("INVALID_REQUEST", ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    /**
     * Catch-all for unhandled exceptions — returns HTTP 500 INTERNAL_SERVER_ERROR.
     * Deliberately suppresses internal detail from the response to prevent information leakage.
     *
     * @param ex Any unhandled exception
     * @return 500 JSON error response with generic message
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneralException(Exception ex) {
        log.error("[System] Unhandled exception: {}", ex.getMessage(), ex);
        return buildErrorResponse(
            "INTERNAL_ERROR",
            "An unexpected error occurred. Please try again later.",
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    /**
     * Constructs a consistent JSON error response body.
     *
     * @param errorCode Machine-readable error code
     * @param message   Human-readable message
     * @param status    HTTP status code
     * @return ResponseEntity with JSON body
     */
    private ResponseEntity<Map<String, Object>> buildErrorResponse(
        String errorCode, String message, HttpStatus status
    ) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("error", errorCode);
        body.put("message", message);
        body.put("timestamp", LocalDateTime.now().toString());
        return ResponseEntity.status(status).body(body);
    }
}
