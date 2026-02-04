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
import com.retailops.inventorysimulator.util.types.autogen.ShopType;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Random;

@Getter
@RequiredArgsConstructor
public abstract class BaseSeedMonteCarloGenerator {

    protected final Random random;
    protected final String simId;
    protected final String shopName;
    protected final ShopType shopType;


    protected BaseSeedMonteCarloGenerator(String simId, String shopName, ShopType shopType) {
        this.simId = simId;
        this.shopName = shopName;
        this.shopType = shopType;
        this.random = new Random(computeSeed(simId, shopName, shopType));
    }

    /**
     * Factory method to compute seed from simId, shopName and shopType
     */
    protected static long computeSeed(
            String simId,
            String shopName,
            ShopType shopType
    ) {
        return SeedFactory.catalogSeed(
                simId,
                shopName,
                shopType.name()
        );
    }

}
