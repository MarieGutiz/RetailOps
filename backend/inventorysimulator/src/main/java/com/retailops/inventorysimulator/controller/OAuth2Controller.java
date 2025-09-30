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

import com.retailops.inventorysimulator.security.config.AuthResponseService;
import com.retailops.inventorysimulator.security.dto.AuthResponse;
import com.retailops.inventorysimulator.security.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth/oauth2")
@RequiredArgsConstructor
public class OAuth2Controller {
    private final JwtService jwtAuthFilter;
//    private final CustomedUserDetailsService userDetailsService;
    private final AuthResponseService authResponseService;

//    @GetMapping("/success")
//    public ResponseEntity<?> success(Authentication authentication) {
//        if (authentication == null) {
//            throw new RuntimeException("Unsuccessful! Authentication is null — OAuth2 login not completed");
//        }
//        String username = ((UserDetails) authentication.getPrincipal()).getUsername();
//
//        // Only check DB existence, no password needed
//        UserDetails userDetails = userDetailsService.authenticateOAuth2(username);
//
//        String token = jwtAuthFilter.generateToken(userDetails);
//        String role = userDetails.getAuthorities().iterator().next().getAuthority();
//
//        return ResponseEntity.ok(new AuthResponse(token, username, role));
//    }

//    @GetMapping("/success")
//    public ResponseEntity<AuthResponse> success(@RequestParam String token, Authentication authentication) {
//        if (authentication == null) {
//            throw new RuntimeException("Unsuccessful! Authentication is null — OAuth2 login not completed");
//        }
//        String username = authentication.getName();
//        String role = authentication.getAuthorities().iterator().next().getAuthority();
//
//        return ResponseEntity.ok(new AuthResponse(token, username, role));
//    }

    @GetMapping("/success")
    public ResponseEntity<AuthResponse> success(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.badRequest().body(AuthResponse.failure("Authentication is null"));
        }

        String username = authentication.getName();
        String role = authentication.getAuthorities().iterator().next().getAuthority();
        String token = jwtAuthFilter.generateToken(username, role);

        return ResponseEntity.ok(AuthResponse.success(token, username, role));
    }

}
