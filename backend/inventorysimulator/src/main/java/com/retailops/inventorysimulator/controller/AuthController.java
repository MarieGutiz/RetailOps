/*
 *
 *  * Copyright (c) 2025
 *  * Author: Mariela Paola Gutierrez
 *  * Repository: https://github.com/mariegutiz
 *  *
 *  * Licensed under the MIT License. You may obtain a copy of the License at:
 *  *     https://opensource.org/licenses/MIT
 *  *
 *  *
 *  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 *
 *
 */

package com.retailops.inventorysimulator.controller;

import com.retailops.inventorysimulator.model.Account;
import com.retailops.inventorysimulator.security.dto.LoginRequest;
import com.retailops.inventorysimulator.security.dto.RegisterRequest;
import com.retailops.inventorysimulator.security.jwt.JwtService;
import com.retailops.inventorysimulator.service.AccountService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtService jwtService;
    private final AccountService accountService;

    // --- Register endpoint ---
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {

        try {
            Account saved = accountService.register(request);
            log.info("[REGISTER] Account registered: {}", saved.getUsername());

            // Always return JSON
            return ResponseEntity.ok(Map.of(
                    "message", "Account registered successfully",
                    "username", saved.getUsername()
            ));
        } catch (Exception e) {
            log.error("[REGISTER] Failed: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "error", "Registration has failed: " + e.getMessage()
            ));
        }
    }

    // --- Login endpoint ---
    @PostMapping(value = "/login" , consumes = "application/json")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        log.info("[LOGIN] Request received for username: {}", request.username());

        try {
            // Authenticate using Spring Security
            Authentication auth = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.username(), request.password())
            );

            log.info("[LOGIN] Authentication success object: {}", auth);

            if (auth.isAuthenticated()) {
                UserDetails userDetails = (UserDetails) auth.getPrincipal();
                String token = jwtService.generateToken(userDetails);

                log.info("[LOGIN] Token generated for user {}: {}", userDetails.getUsername(), token);

                // Return JSON with token
                return ResponseEntity.ok(Map.of(
                        "username", userDetails.getUsername(),
                        "token", token,
                        "roles", userDetails.getAuthorities().stream()
                                .map(Object::toString)
                                .toList()
                ));
            } else {
                log.warn("[LOGIN] Invalid credentials for user: {}", request.username());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                        "error", "Invalid login"
                ));
            }
        } catch (Exception e) {
            log.error("[LOGIN] Authentication failed for user {}: {}", request.username(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "error", "Login failed: " + e.getMessage()
            ));
        }
    }
}

