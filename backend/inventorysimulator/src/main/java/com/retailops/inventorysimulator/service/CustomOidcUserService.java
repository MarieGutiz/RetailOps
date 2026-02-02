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
import com.retailops.inventorysimulator.util.types.AuthProviderType;
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
    private final AccountService accountService;

    @Override
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
        // Delegate to default implementation
        OidcUser oidcUser = new OidcUserService().loadUser(userRequest);
        log.info("[LOGIN] OAuth2User attributes: {}", oidcUser.getAttributes());


        // Extract user info (email is guaranteed with "openid, email" scopes)
        String email = oidcUser.getEmail();
        String name = oidcUser.getFullName();
        String avatarUrl = (String) oidcUser.getAttributes().get("picture");
        String providerId = oidcUser.getSubject(); // unique Google ID

        log.info("[LOGIN] OAuth2User name: {}, email{}, avatar{}, providerId{} ", name, email, avatarUrl, providerId);

        // Persist user if not already in DB
        Account account = accountService
                .findByProviderAndProviderId(AuthProviderType.GOOGLE, providerId)
                .orElseGet(Account::new);

        account.setProvider(AuthProviderType.GOOGLE);
        account.setProviderId(providerId);
        account.setUsername(email);
        account.setEmail(email);
        account.setName(name != null ? name : email);
        account.setAvatar(avatarUrl);
        account.setRole("USER_GOOGLE");

        if (account.getRegistrationDate() == null) {
            account.setRegistrationDate(LocalDate.now());
        }
        if (account.getPassword() == null) {
            account.setPassword(UUID.randomUUID().toString());
        }

        accountService.save(account);

        // Optional: update avatar if Google changed it
        if (avatarUrl != null && !avatarUrl.equals(account.getAvatar())) {
            account.setAvatar(avatarUrl);
            accountService.save(account);
        }
        // Return user with authorities (ROLE_USER by default)
        return new DefaultOidcUser(
                Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
                oidcUser.getIdToken(),
                oidcUser.getUserInfo()
        );
    }
}
