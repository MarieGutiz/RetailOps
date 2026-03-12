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
import com.retailops.inventorysimulator.security.dto.RegisterRequest;
import com.retailops.inventorysimulator.util.types.AuthProviderType;

import java.util.Optional;

/**
 * Service interface for managing {@link Account} entities.
 * Provides methods for account retrieval, registration, updates,
 * and lookup by username, email, or external authentication provider.
 */
public interface AccountService extends BaseService<Account, Long> {
    Optional<Account> findByUsername(String username);
    Account register(RegisterRequest request);
    Optional<Account> findByEmail(String email);
    Optional<Account> findByProviderAndProviderId(AuthProviderType provider, String providerId);
    Account save(Account account); // for updates
    void updateAccount(Account account);
}
