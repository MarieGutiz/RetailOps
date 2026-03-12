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

package com.retailops.inventorysimulator.exception;

import lombok.Getter;

/**
 * Custom runtime exception thrown when authentication fails for a specific user.
 *
 * Stores the email of the user for whom the authentication error occurred,
 * along with a descriptive error message.
 */

@Getter
public class AuthException extends RuntimeException {
    private final String email;

    public AuthException(String email, String message) {
        super(message);
        this.email = email;
    }
}
