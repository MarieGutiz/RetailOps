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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.Collections;
import java.util.Map;
import java.util.UUID;

/**
 * Custom {@link OAuth2UserService} implementation for handling OAuth2 logins,
 * specifically for GitHub authentication.
 *
 * <p>Loads user details from the OAuth2 provider, maps them to a local {@link Account},
 * handles account creation or update, and builds a Spring Security {@link OAuth2User}
 * with the appropriate roles.</p>
 */

@Service
@RequiredArgsConstructor
@Transactional
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {
    private static final Logger log = LoggerFactory.getLogger(CustomOAuth2UserService.class);
    private final AccountService accountService;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        // Use Spring’s default implementation
        DefaultOAuth2UserService delegate = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = delegate.loadUser(userRequest);

        Map<String, Object> attributes = oAuth2User.getAttributes();

        log.info("[LOGIN][GitHub] OAuth2User attributes: {}", oAuth2User.getAttributes());

        String providerId = String.valueOf(attributes.get("id"));
        String login = (String) attributes.get("login");
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");
        String avatar = (String) attributes.get("avatar_url");

        if (email == null) {
            email = login + "@github.local";
        }
        if (name == null) {
            name = login;
        }

        Account account = accountService
                .findByProviderAndProviderId(AuthProviderType.GITHUB, providerId)
                .orElseGet(Account::new);

        account.setProvider(AuthProviderType.GITHUB);
        account.setProviderId(providerId);
        account.setUsername(login);
        account.setEmail(email);
        account.setName(name);
        account.setAvatar(avatar);
        account.setRole("USER_GITHUB");

        if (account.getRegistrationDate() == null) {
            account.setRegistrationDate(LocalDate.now());
        }

        if (account.getPassword() == null) {
            account.setPassword(UUID.randomUUID().toString());
        }

        accountService.save(account);

        // Build Spring Security user
        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
                oAuth2User.getAttributes(),
                "id" // because in application.properties is set: provider.github.user-name-attribute=id
        );
    }
}

