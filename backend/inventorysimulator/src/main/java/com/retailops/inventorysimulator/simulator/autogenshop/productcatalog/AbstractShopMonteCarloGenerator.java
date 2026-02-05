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


import com.retailops.inventorysimulator.model.Product;
import com.retailops.inventorysimulator.simulator.autogenshop.BaseSeedMonteCarloGenerator;
import com.retailops.inventorysimulator.simulator.dto.MonteCarloItemDto;
import com.retailops.inventorysimulator.util.distribution.Normal;
import com.retailops.inventorysimulator.util.types.autogen.DemandModel;
import com.retailops.inventorysimulator.util.types.autogen.ShopType;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

/**
 * Generic Monte Carlo generator for shops.
 * <p>
 * Handles shared process for ABC or EOQ simulations:
 * - Generate catalog from provided catalog generator
 * - Iterate through product specs
 * - Generate demand based on NORMAL or UNIFORM distribution
 */

public abstract class AbstractShopMonteCarloGenerator<TSpec> extends BaseSeedMonteCarloGenerator {


    protected AbstractShopMonteCarloGenerator(
            String simId,
            String shopName,
            ShopType shopType
    ) {
        super(simId, shopName, shopType);
    }

    /**
     * Returns the shop's product catalog using the injected catalog generator.
     */
    protected abstract List<Product> getCatalog();

    /**
     * Returns all product specs for the shop.
     */
    protected abstract TSpec[] getSpecs();

    /**
     * Returns the demand model for a given product spec.
     */
    protected abstract DemandModel getDemandModel(TSpec spec);

    /**
     * Returns the minimum/mean demand for a given product spec.
     */
    protected abstract int getDemandMeanOrMin(TSpec spec);

    /**
     * Returns the maximum/standard deviation for a given product spec.
     */
    protected abstract int getDemandStdOrMax(TSpec spec);

    /**
     * Generates the Monte Carlo inventory using shared process logic.
     */
    public List<MonteCarloItemDto> generateInventory() {
        List<Product> catalog = getCatalog();
        List<MonteCarloItemDto> items = new ArrayList<>();

        TSpec[] specs = getSpecs();

        for (int i = 0; i < specs.length; i++) {
            Product product = catalog.get(i);
            TSpec spec = specs[i];

            MonteCarloItemDto item = switch (getDemandModel(spec)) {
                case NORMAL -> generateNormalItem(spec, product);
                case UNIFORM -> generateUniformItem(spec, product);
            };

            items.add(item);
        }

        return items;
    }

    // -------------------------
    // Common demand generators
    // -------------------------

    private MonteCarloItemDto generateNormalItem(TSpec spec, Product product) {
        int demand = Math.max(
                (int) Math.round(
                        Normal.normal(
                                getDemandMeanOrMin(spec),
                                getDemandStdOrMax(spec),
                                random
                        )
                ),
                getDemandMeanOrMin(spec) / 3
        );
        return buildItem(product, demand);
    }

    private MonteCarloItemDto generateUniformItem(TSpec spec, Product product) {
        int demand = random.nextInt(
                getDemandStdOrMax(spec) - getDemandMeanOrMin(spec) + 1
        ) + getDemandMeanOrMin(spec);
        return buildItem(product, demand);
    }

    private MonteCarloItemDto buildItem(Product product, int demand) {
        MonteCarloItemDto dto = new MonteCarloItemDto();
        dto.setProduct(product);
        dto.setDemandFrequency(BigInteger.valueOf(demand));
        dto.setSalesValue(product.getUnitPrice().multiply(BigDecimal.valueOf(demand)));
        return dto;
    }

}
