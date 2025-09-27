package com.retailops.inventorysimulator.exception;

import com.retailops.inventorysimulator.security.dto.AuthResponse;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Handle Bean Validation (@Valid) errors
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, Object> body = new HashMap<>();
        getErrorMap(body, HttpStatus.BAD_REQUEST);
        body.put("errors", ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.toList()));
        return ResponseEntity.badRequest().body(body);
    }

    // Handle @Validated constraints (e.g., @Min on method params)
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Map<String, Object>> handleConstraintViolations(ConstraintViolationException ex) {
        Map<String, Object> body = new HashMap<>();
        getErrorMap(body,HttpStatus.BAD_REQUEST);
        body.put("errors", ex.getConstraintViolations()
                .stream()
                .map(v -> v.getPropertyPath() + ": " + v.getMessage())
                .collect(Collectors.toList()));
        return ResponseEntity.badRequest().body(body);
    }

    // Handle runtime errors (e.g., product not found)
    @ExceptionHandler(ProductNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleProductNotFound(ProductNotFoundException ex) {
        Map<String, Object> body = new HashMap<>();
        getErrorMap(body, HttpStatus.NOT_FOUND);
        body.put("error-product", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }

    // Catch-all handler for any other errors
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneral(Exception ex) {
        Map<String, Object> body = new HashMap<>();
        getErrorMap(body, HttpStatus.INTERNAL_SERVER_ERROR);
        body.put("error", "Unexpected error: " + ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }

    private void getErrorMap(Map<String, Object> body, HttpStatus status) {
        body.put("timestamp", LocalDateTime.now());
        body.put("status", status.value());
    }

    @ExceptionHandler(AuthException.class)
    public ResponseEntity<AuthResponse> handleAuthException(AuthException ex) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(AuthResponse.failure("Auth failed for " + ex.getUsername() + ": " + ex.getMessage()));
    }
}
