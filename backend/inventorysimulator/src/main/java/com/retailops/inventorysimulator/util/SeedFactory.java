/*
 *
 *  * Copyright (c) 2026
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

package com.retailops.inventorysimulator.util;

import lombok.RequiredArgsConstructor;

import java.util.Objects;

/**
 * Utility factory for generating deterministic seeds used in simulations.
 *
 * <p>The seed is derived from stable identifiers such as simulation ID,
 * shop name, and shop type to ensure reproducible random data generation
 * across simulation runs.</p>
 *
 * <p>This approach guarantees that the same input parameters will always
 * produce the same seed, enabling consistent catalog generation and
 * repeatable simulation results.</p>
 */
@RequiredArgsConstructor
public class SeedFactory {

    public static long catalogSeed(
            String simId,
            String shopName,
            String shopType
    ) {
        return Objects.hash(simId, shopName, shopType);
    }

}
