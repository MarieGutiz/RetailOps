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

package com.retailops.inventorysimulator.service;

import com.retailops.inventorysimulator.model.Account;
import com.retailops.inventorysimulator.repository.UserRepository;
import com.retailops.inventorysimulator.util.AuthProviderType;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;


import java.time.LocalDate;
import java.util.Collections;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomOidcUserService implements OAuth2UserService<OidcUserRequest, OidcUser> {
    private final UserRepository userRepository;

    @Override
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
        // Delegate to default implementation
        OidcUser oidcUser = new OidcUserService().loadUser(userRequest);
        log.info("[LOGIN] OAuth2User attributes: {}", oidcUser.getAttributes());


        // Extract user info (email is guaranteed with "openid, email" scopes)
        String email = oidcUser.getEmail();
        String name = oidcUser.getFullName();
        log.info("[LOGIN] OAuth2User name: {}, email{}", name, email);

        // Persist user if not already in DB
        userRepository.findByUsername(email).orElseGet(() -> {
            Account newAcc = new Account();
            newAcc.setUsername(email);
            newAcc.setEmail(email);
            newAcc.setName(name != null ? name : email);
            newAcc.setPassword(UUID.randomUUID().toString());
            newAcc.setRole("USER_GOOGLE");
            newAcc.setProvider(AuthProviderType.GOOGLE);
            newAcc.setRegistrationDate(LocalDate.now());
            return userRepository.save(newAcc);
        });

        // Return user with authorities (ROLE_USER by default)
        return new DefaultOidcUser(
                Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
                oidcUser.getIdToken(),
                oidcUser.getUserInfo()
        );
    }
}
