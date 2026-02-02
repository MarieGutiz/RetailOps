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
import com.retailops.inventorysimulator.repository.AccountRepository;
import com.retailops.inventorysimulator.security.dto.RegisterRequest;
import com.retailops.inventorysimulator.util.types.AuthProviderType;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl extends BaseServiceImpl<Account> implements AccountService{
    private  final AccountRepository accountRepository;
    private final PasswordEncoder encoder;

    @Override
    protected JpaRepository<Account, Long> getRepository() {
        return accountRepository;
    }

    @Override
    public Optional<Account> findByUsername(String username) {
        return Optional.of(accountRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("No account found for this username")));
    }

    @Override
    public Optional<Account> findByEmail(String email) {
        return Optional.of(accountRepository.findByEmail(email))
                .orElseThrow(() -> new AuthException(email, "No account found for this email address"));
    }

    @Override
    public Optional<Account> findByProviderAndProviderId(AuthProviderType provider, String providerId) {
        if (provider == null || providerId == null) return Optional.empty();
        return accountRepository.findByProviderAndProviderId(provider, providerId);
    }

    @Override
    public Account register(RegisterRequest request) {
        Account account = new Account();
        account.setUsername(request.username());
        account.setPassword(encoder.encode(request.password())); // hash password
        account.setName(request.name());
        account.setEmail(request.email());
        account.setRole(request.role());
        account.setPosition(request.position());
        account.setProvider(AuthProviderType.LOCAL);
        account.setProviderId(UUID.randomUUID().toString()); // unique ID for local accounts
        account.setAvatar(null);
        account.setRegistrationDate(LocalDate.now());

        return accountRepository.save(account);

    }

    @Override
    public Account save(Account account) {
        return accountRepository.save(account);
    }

    @Override
    public void updateAccount(Account updated) {
        Account existing = accountRepository.findById(updated.getId())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        // Update only allowed fields:
        if (updated.getName() != null) existing.setName(updated.getName());
        if (updated.getEmail() != null) existing.setEmail(updated.getEmail());
        if (updated.getUsername() != null) existing.setUsername(updated.getUsername());
        if (updated.getPosition() != null) existing.setPosition(updated.getPosition());

        // If password was changed (avoid overwriting with null)
        if (updated.getPassword() != null && !updated.getPassword().isEmpty()) {
            existing.setPassword(encoder.encode(updated.getPassword()));
        }

        accountRepository.save(existing);
    }

}
