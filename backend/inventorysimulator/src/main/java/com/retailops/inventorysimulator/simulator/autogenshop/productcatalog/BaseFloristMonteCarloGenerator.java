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

package com.retailops.inventorysimulator.simulator.autogenshop.productcatalog;

import com.retailops.inventorysimulator.util.SeedFactory;
import lombok.Getter;

import java.util.Random;

@Getter
public abstract class BaseFloristMonteCarloGenerator {

    protected final Random random;

    /**
     * Construct with a given seed for deterministic generation
     */
    protected BaseFloristMonteCarloGenerator(long seed) {
        this.random = new Random(seed);
    }

    /**
     * Construct with default random (non-deterministic)
     */
    protected BaseFloristMonteCarloGenerator() {
        this.random = new Random();
    }

    /**
     * Factory method to compute seed from simId and shopName
     */
    protected static long computeSeed(String simId, String shopName) {
        return SeedFactory.catalogSeed(simId, shopName, "FLORIST");
    }


    protected BaseFloristMonteCarloGenerator(String simId, String shopName) {
        this(computeSeed(simId, shopName));
    }


}
