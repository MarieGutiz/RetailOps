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

package com.retailops.inventorysimulator.simulator.autogenshop.productcatalog.florist;

import com.retailops.inventorysimulator.model.Product;
import com.retailops.inventorysimulator.util.types.autogen.FloristProductSpec;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import static com.retailops.inventorysimulator.simulator.segmentation.AbcSummaryBuilder.buildSku;
import static com.retailops.inventorysimulator.simulator.segmentation.AbcSummaryBuilder.randomCost;


/**
 * Generates the product catalog for a Florist shop.
 * <p>
 * Each product's cost is randomly determined within its defined range,
 * and the unit price is calculated using the specified markup.
 */

@Service
public class FloristProductCatalogGenerator {

    /**
     * Generates the full florist product catalog.
     *
     * @param random Random instance for deterministic or stochastic generation
     * @return list of products
     */
    public List<Product> generateCatalog(Random random) {
        List<Product> products = new ArrayList<>();
        for (FloristProductSpec spec : FloristProductSpec.values()) {
            products.add(buildProduct(spec, random));
        }
        return products;
    }


    /**
     * Builds a single product instance from a CafeteriaProductSpec.
     *
     * @param spec   product specification
     * @param random Random instance
     * @return generated Product
     */

    private Product buildProduct(FloristProductSpec spec, Random random) {
        BigDecimal unitCost = randomCost(
                spec.getMinCost(),
                spec.getMaxCost(),
                random
        );

        BigDecimal unitPrice = unitCost
                .multiply(BigDecimal.valueOf(spec.getMarkup()))
                .setScale(2, RoundingMode.HALF_UP);

        Product p = new Product();
        p.setName(spec.getName());
        p.setSku(buildSku("FLR", spec.getName()));
        p.setCategory(spec.getCategory().name());
        p.setUnitCost(unitCost);
        p.setUnitPrice(unitPrice);
        p.setDescription(spec.getCategory() + " florist item");
        return p;
    }


}
