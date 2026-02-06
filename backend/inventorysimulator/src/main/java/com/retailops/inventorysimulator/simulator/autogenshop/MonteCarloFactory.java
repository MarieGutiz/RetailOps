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

package com.retailops.inventorysimulator.simulator.autogenshop;

import com.retailops.inventorysimulator.simulator.autogenshop.productcatalog.cafeteria.CafeteriaAbcMonteCarloGenerator;
import com.retailops.inventorysimulator.simulator.autogenshop.productcatalog.cafeteria.CafeteriaEOQMonteCarloGenerator;
import com.retailops.inventorysimulator.simulator.autogenshop.productcatalog.cafeteria.CafeteriaProductCatalogGenerator;
import com.retailops.inventorysimulator.simulator.autogenshop.productcatalog.florist.FloristAbcMonteCarloGenerator;
import com.retailops.inventorysimulator.simulator.autogenshop.productcatalog.florist.FloristEOQMonteCarloGenerator;
import com.retailops.inventorysimulator.simulator.autogenshop.productcatalog.florist.FloristProductCatalogGenerator;

import com.retailops.inventorysimulator.simulator.generator.components.NewsvendorMonteCarloGenerator;
import com.retailops.inventorysimulator.util.types.autogen.ShopType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * Factory component for creating Monte Carlo generators.
 * <p>
 * This class provides ready-to-use generator instances for different
 * shop types (Florist, Cafeteria) and simulation methods (ABC, EOQ, etc.).
 */

@Component
@RequiredArgsConstructor
public class MonteCarloFactory {

    private final FloristProductCatalogGenerator floristProductCatalogGenerator;
    private final CafeteriaProductCatalogGenerator cafeteriaProductCatalogGenerator;

    //florist
    public FloristAbcMonteCarloGenerator abcFlorist(
            String simId,
            String shopName
    ) {
        return new FloristAbcMonteCarloGenerator(
                simId,
                shopName,
                floristProductCatalogGenerator
        );
    }

    public FloristEOQMonteCarloGenerator eoqFlorist(
            String simId,
            String shopName
    ) {
        return new FloristEOQMonteCarloGenerator(
                simId,
                shopName,
                floristProductCatalogGenerator
        );
    }


    /* =========================
       CAFETERIA GENERATORS
       ========================= */

    /**
     * Create an ABC Monte Carlo generator for a cafeteria shop.
     *
     * @param simId    simulation identifier
     * @param shopName shop name
     * @return Cafeteria ABC Monte Carlo generator
     */
    public CafeteriaAbcMonteCarloGenerator abcCafeteria(
            String simId,
            String shopName
    ) {
        return new CafeteriaAbcMonteCarloGenerator(
                simId,
                shopName,
                cafeteriaProductCatalogGenerator
        );
    }

    /**
     * Create an EOQ Monte Carlo generator for a cafeteria shop.
     *
     * @param simId    simulation identifier
     * @param shopName shop name
     * @return Cafeteria EOQ Monte Carlo generator
     */
    public CafeteriaEOQMonteCarloGenerator eoqCafeteria(
            String simId,
            String shopName
    ) {
        return new CafeteriaEOQMonteCarloGenerator(
                simId,
                shopName,
                cafeteriaProductCatalogGenerator
        );
    }

    public NewsvendorMonteCarloGenerator newsvendor(
            String simId,
            String shopName,
            ShopType shopType
    ) {
        return new NewsvendorMonteCarloGenerator(simId, shopName, shopType);
    }
}
