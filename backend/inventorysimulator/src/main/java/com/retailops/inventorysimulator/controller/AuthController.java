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

import com.retailops.inventorysimulator.exception.AuthException;
import com.retailops.inventorysimulator.model.Account;
import com.retailops.inventorysimulator.security.dto.AuthResponse;
import com.retailops.inventorysimulator.security.dto.LoginRequest;
import com.retailops.inventorysimulator.security.dto.RegisterRequest;
import com.retailops.inventorysimulator.security.jwt.JwtService;
import com.retailops.inventorysimulator.service.AccountService;
import com.retailops.inventorysimulator.service.CustomedUserDetailsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    private final JwtService jwtService;
    private final AccountService accountService;
    private final CustomedUserDetailsService userDetailsService;

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
    @PostMapping(value = "/login", consumes = "application/json")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
       log.info("[LOGIN] Request received for email: {}", request.identifier());


        try {
            // Delegate authentication to service / search username and password
            UserDetails userDetails = userDetailsService.authenticate(request);

            String token = jwtService.generateToken(userDetails);
            String role = userDetails.getAuthorities().iterator().next().getAuthority();

            AuthResponse response = userDetailsService.response(token, role, request);

            log.info("[LOGIN] Authentication success, token generated for user {}", userDetails.getUsername());
            return ResponseEntity.ok(response);

        } catch (AuthException e) {
            //log.error("[LOGIN] Authentication failed for user {}: {}", request.email(), e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse(null, null, null,null, null, null, null, null));
        }
    }
}

