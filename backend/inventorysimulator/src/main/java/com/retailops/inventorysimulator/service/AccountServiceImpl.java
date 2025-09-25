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
import com.retailops.inventorysimulator.security.dto.RegisterRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl extends BaseServiceImpl<Account> implements AccountService{
    private  final UserRepository userRepository;
    private final PasswordEncoder encoder;

    @Override
    protected JpaRepository<Account, Long> getRepository() {
        return userRepository;
    }

    @Override
    public Optional<Account> findByUsername(String username) {
        return Optional.of(userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("No account found for this username")));
    }

//    @Override
//    public Account register(Account account) {
//        account.setPassword(encoder.encode(account.getPassword()));
//        account.setRole("ROLE_USER");
//        account.setRegistrationDate(LocalDate.now());
//        return userRepository.save(account);
//    }

    @Override
    public Account register(RegisterRequest request) {
        Account account = new Account();
        account.setUsername(request.username());
        account.setPassword(encoder.encode(request.password())); // hash password
        account.setName(request.name());
        account.setRole(request.role());
        account.setPosition(request.position());
        account.setRegistrationDate(LocalDate.now());

        return userRepository.save(account);

    }


}
