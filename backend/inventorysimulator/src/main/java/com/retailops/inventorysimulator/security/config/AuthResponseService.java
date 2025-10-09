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

package com.retailops.inventorysimulator.security.config;

import com.retailops.inventorysimulator.model.Account;
import com.retailops.inventorysimulator.security.dto.AuthResponse;
import com.retailops.inventorysimulator.security.jwt.JwtService;
import com.retailops.inventorysimulator.service.AccountService;
import com.retailops.inventorysimulator.service.CustomedUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Service
@RequiredArgsConstructor
public class AuthResponseService {
    private final JwtService jwtService;
    private final CustomedUserDetailsService userDetailsService;

    public AuthResponse buildResponse(String username, Collection<? extends GrantedAuthority> authorities) {
        String token = jwtService.generateToken(username);
        String role = authorities.iterator().next().getAuthority(); // pick first role

        Account account = userDetailsService.authenticateOAuth2(username);

        return new AuthResponse(token,
                account.getEmail(),
                account.getUsername(),
                account.getName(),
                role);

        //accountService.findByEmail()
    }
}
