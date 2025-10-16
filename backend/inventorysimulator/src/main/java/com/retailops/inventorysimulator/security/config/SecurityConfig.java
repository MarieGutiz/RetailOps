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

import com.fasterxml.jackson.databind.ObjectMapper;
import com.retailops.inventorysimulator.security.dto.AuthResponse;
import com.retailops.inventorysimulator.security.jwt.JwtAuthFilter;
import com.retailops.inventorysimulator.service.CustomOAuth2UserService;
import com.retailops.inventorysimulator.service.CustomOidcUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
public class SecurityConfig  {
//    private final CustomOAuth2UserService customOAuth2UserService;
    private final JwtAuthFilter jwtAuthFilter;
//    private final AuthResponseService authResponseService;
    private final CustomOidcUserService customOidcUserService;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;
   // private final JwtService jwtService;

//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http
//                .csrf(csrf -> csrf.disable()) // disable CSRF for APIs
//                .authorizeHttpRequests(auth -> auth
//                        .anyRequest().permitAll()  // allow all requests without login
//                );
//        return http.build();
//    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/products/**").permitAll()
                        .requestMatchers("/auth/**", "/api/auth/**").permitAll()
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))//change to stateless
//                .oauth2Login(oauth2 -> oauth2
//                        .userInfoEndpoint(userInfo -> userInfo
//                                .oidcUserService(customOidcUserService)   // Google
//                                .userService(customOAuth2UserService)    // GitHub
//                        )
//                        .successHandler((request, response, authentication) -> {
//                            String email = authentication.getName(); // now it's the email
//                            AuthResponse authResponse =
//                                    authResponseService.buildResponse(email, authentication.getAuthorities());
//
//                            response.setContentType("application/json");
//                            new ObjectMapper().writeValue(response.getWriter(), authResponse);
//                        })
//                )
                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userInfo -> userInfo
                                .oidcUserService(customOidcUserService)   // Google
                                .userService(customOAuth2UserService)    // GitHub
                        )
                        .successHandler(
//                                (request, response, authentication) -> {
//                            String email;
//                            Object principal = authentication.getPrincipal();
//
//                            if (principal instanceof OidcUser oidcUser) {
//                                // Google
//                                email = oidcUser.getEmail();
//                            } else if (principal instanceof OAuth2User oauth2User) {
//                                // GitHub
//                                email = (String) oauth2User.getAttributes().getOrDefault("email",
//                                        oauth2User.getAttributes().get("login"));
//                            } else {
//                                email = authentication.getName();
//                            }
//
//                            AuthResponse authResponse =
//                                    authResponseService.buildResponse(email, authentication.getAuthorities());
//
//                            response.setContentType("application/json");
//                            new ObjectMapper().writeValue(response.getWriter(), authResponse);

                                oAuth2SuccessHandler
                        )
                )

                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    // Simpler authentication manager, no manual injection of user service
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

}
