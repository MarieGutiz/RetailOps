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
import com.retailops.inventorysimulator.util.SeedFactory;
import com.retailops.inventorysimulator.util.types.autogen.CafeteriaProductSpec;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import static com.retailops.inventorysimulator.simulator.segmentation.AbcSummaryBuilder.buildSku;

@Service
public class CafeteriaProductCatalogGenerator {

    public List<Product> generate(String simId, String shopName) {
        long seed = SeedFactory.catalogSeed(simId, shopName, "CAFETERIA");
        Random random = new Random(seed);

        List<Product> products = new ArrayList<>();

        for (CafeteriaProductSpec spec : CafeteriaProductSpec.values()) {
            products.add(buildProduct(spec, random));
        }

        return products;
    }

    private Product buildProduct(
            CafeteriaProductSpec spec,
            Random random
    ) {
        BigDecimal unitCost = randomCost(
                spec.minUnitCost,
                spec.maxUnitCost,
                random
        );

        BigDecimal unitPrice = unitCost
                .multiply(BigDecimal.valueOf(spec.markup))
                .setScale(2, RoundingMode.HALF_UP);

        Product p = new Product();
        p.setName(spec.name);
        p.setSku(buildSku("CAF", spec.name));
        p.setCategory(spec.category.name());
        p.setUnitCost(unitCost);
        p.setUnitPrice(unitPrice);
        p.setDescription(spec.category + " cafeteria item");

        return p;
    }

    private BigDecimal randomCost(
            double min,
            double max,
            Random random
    ) {
        double value = min + random.nextDouble() * (max - min);
        return BigDecimal.valueOf(value)
                .setScale(2, RoundingMode.HALF_UP);
    }

}
