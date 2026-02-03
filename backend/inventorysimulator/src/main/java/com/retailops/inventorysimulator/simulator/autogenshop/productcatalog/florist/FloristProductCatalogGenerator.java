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
import com.retailops.inventorysimulator.simulator.autogenshop.productcatalog.BaseFloristMonteCarloGenerator;
import com.retailops.inventorysimulator.util.types.autogen.FloristProductSpec;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import static com.retailops.inventorysimulator.simulator.segmentation.AbcSummaryBuilder.buildSku;

@Service
public class FloristProductCatalogGenerator {

    public List<Product> generateCatalog(Random random) {
        List<Product> products = new ArrayList<>();
        for (FloristProductSpec spec : FloristProductSpec.values()) {
            products.add(buildProduct(spec, random));
        }
        return products;
    }

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

    private BigDecimal randomCost(double min, double max, Random random) {
        double value = min + random.nextDouble() * (max - min);
        return BigDecimal.valueOf(value).setScale(2, RoundingMode.HALF_UP);
    }

}
