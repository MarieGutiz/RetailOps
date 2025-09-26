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

import com.retailops.inventorysimulator.security.jwt.JwtAuthFilter;
import com.retailops.inventorysimulator.security.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/auth/oauth2")
@RequiredArgsConstructor
public class OAuth2Controller {
    private  final JwtService jwtAuthFilter;

    @GetMapping("/success")
    public ResponseEntity<?> success(Authentication authentication) {
        UserDetails user = (UserDetails) authentication.getPrincipal();
        String token = jwtAuthFilter.generateToken(user);

        return ResponseEntity.ok(Map.of(
                "message", "Google login successful",
                "token", token
        ));
    }

}
