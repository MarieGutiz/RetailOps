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

import com.retailops.inventorysimulator.exception.AuthException;
import com.retailops.inventorysimulator.model.Account;
import com.retailops.inventorysimulator.repository.UserRepository;
import com.retailops.inventorysimulator.security.dto.AuthResponse;
import com.retailops.inventorysimulator.security.dto.LoginRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomedUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Account user = userRepository.findByUsername(username).
                orElseThrow(() -> new UsernameNotFoundException("User not found, load by username: " + username));

        return User.withUsername(user.getUsername())
                .password(user.getPassword())
                .roles(user.getRole())
                .build();
    }

    //Check user's info in the db
    // Standard username/password login
    public UserDetails authenticate(LoginRequest request) {
        Account account = getAccountByEmailOrUsername(request);

        if (!encoder.matches(request.password(), account.getPassword())) {
            throw new AuthException(account.getUsername(), "Invalid password");
        }

        return buildUserDetails(account);
    }

    private Account getAccountByEmailOrUsername(LoginRequest request) {
        Account account;

        account = userRepository.findByEmail(request.identifier())
                .orElseGet(() -> userRepository.findByUsername(request.identifier())
                        .orElseThrow(() -> new UsernameNotFoundException("User not found nor email: " + request.identifier())));

        return account;
    }

    // OAuth2 login: just check DB and return UserDetails
    public Account authenticateOAuth2(String usernameOrEmail) {

        return userRepository.findByUsername(usernameOrEmail)
                .or(() -> userRepository.findByEmail(usernameOrEmail))
                .orElseThrow(() -> new AuthException(usernameOrEmail, "User not found "+usernameOrEmail));
    }

    private UserDetails buildUserDetails(Account account) {
        return User.withUsername(account.getUsername())
//                .username(account.getEmail())
                .password(account.getPassword())
                .roles(account.getRole())
                .build();
    }

    public AuthResponse response(String token, String role,LoginRequest request){
        Account account = this.getAccountByEmailOrUsername(request);
        return AuthResponse.success(
                token,
                account.getId(),
                account.getEmail(),
                account.getUsername(),
                account.getName(),
                role,
                account.getPosition());
    }

}
