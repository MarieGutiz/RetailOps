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

package com.retailops.inventorysimulator.security.dto;

public record AuthResponse(
        String token,
        Long id,
        String email,
        String username,
        String name,
        String role,
        String position
     //   String error // optional, only used on failure
) {

        // Success factory
        public static AuthResponse success(String token, long id, String email, String username, String name, String role, String position){
            return new AuthResponse(token,id, email, username, name, role, position);
        }

        // Failure factory
        public static AuthResponse failure(String err) {
            return new AuthResponse(null, null, null, null, null, null, null);
        }
}

