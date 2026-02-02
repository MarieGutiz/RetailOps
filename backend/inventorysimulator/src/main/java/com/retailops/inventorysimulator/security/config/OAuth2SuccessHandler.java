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

import com.retailops.inventorysimulator.exception.AuthException;
import com.retailops.inventorysimulator.model.Account;
import com.retailops.inventorysimulator.security.jwt.JwtService;
import com.retailops.inventorysimulator.service.CustomedUserDetailsService;
import com.retailops.inventorysimulator.util.types.AuthProviderType;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final CustomedUserDetailsService userDetailsService;
    private final JwtService jwtService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        // Extract email or username from authentication
        String email;
        Object principal = authentication.getPrincipal();
        String avatarUrl = null;
        AuthProviderType provider;
        String providerId;

        if (principal instanceof OidcUser oidcUser) {
            provider = AuthProviderType.GOOGLE;
            providerId = oidcUser.getSubject(); // "sub"
            avatarUrl = (String) oidcUser.getAttributes().get("picture");
        } else if (principal instanceof OAuth2User oauth2User) {
            provider = AuthProviderType.GITHUB;
            providerId = String.valueOf(oauth2User.getAttributes().get("id")); // GitHub user ID
            avatarUrl = (String) oauth2User.getAttributes().get("avatar_url");
        } else {
            // fallback LOCAL
            provider = AuthProviderType.LOCAL;
            providerId = null;
        }

        // Look up account details in your DB
        Account account;

        if (provider == AuthProviderType.LOCAL) {
            // fallback for local login
            account = userDetailsService.authenticateOAuth2(authentication.getName());
        } else {
            account = userDetailsService.findByProviderAndProviderId(provider, providerId)
                    .orElseThrow(() -> new AuthException(provider + ":" + providerId, "User not found"));
        }
        // If GitHub login → update avatar
        if (avatarUrl != null && !avatarUrl.isBlank() && !avatarUrl.equals(account.getAvatar())) {
            account.setAvatar(avatarUrl);
            userDetailsService.updateOAuth2Account(account);
        }
        //Build JWT
        String role = authentication.getAuthorities().iterator().next().getAuthority();

        // Generate token
        String token = jwtService.generateToken(account.getUsername(), role);

        // Build redirect URL for frontend
        String redirectUrl = "http://localhost:5173/oauth2/redirect"
                + "?token=" + token
                + "&id=" + account.getId()
                + "&email=" + URLEncoder.encode(account.getEmail(), StandardCharsets.UTF_8)
                + "&username=" + URLEncoder.encode(account.getUsername(), StandardCharsets.UTF_8)
                + "&name=" + URLEncoder.encode(account.getName(), StandardCharsets.UTF_8)
                + "&role=" + account.getRole()
                + "&position=" + (account.getPosition() != null ? account.getPosition() : "")
                + "&profileImage=" + URLEncoder.encode(
                account.getAvatar() != null ? account.getAvatar() : "",
                StandardCharsets.UTF_8
        );

        // Redirect to frontend
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
