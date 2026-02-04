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
import com.retailops.inventorysimulator.simulator.autogenshop.productcatalog.BaseSeedMonteCarloGenerator;
import com.retailops.inventorysimulator.simulator.generator.EoqMonteCarloSample;
import com.retailops.inventorysimulator.util.distribution.Normal;
import com.retailops.inventorysimulator.util.types.autogen.FloristEoqPolicy;
import com.retailops.inventorysimulator.util.types.autogen.FloristProductSpec;
import com.retailops.inventorysimulator.util.types.autogen.ShopType;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.math.RoundingMode;
import java.util.List;

public class FloristEOQMonteCarloGenerator extends BaseSeedMonteCarloGenerator {

    private final FloristProductCatalogGenerator catalog;

    public FloristEOQMonteCarloGenerator(
            String simId,
            String shopName,
            FloristProductCatalogGenerator catalog
    ) {
        super(simId, shopName, ShopType.FLORIST);
        this.catalog = catalog;
    }

    public List<EoqMonteCarloSample> generate() {

        // 1. Deterministic catalog (same as ABC)
        List<Product> products = catalog.generateCatalog(this.random);

        // 2. Decorate with EOQ randomness
        return products.stream()
                .map(this::toEoqSample)
                .toList();
    }

    private EoqMonteCarloSample toEoqSample(Product product) {

        FloristProductSpec spec =
                FloristProductSpec.fromName(product.getName());

        FloristEoqPolicy policy =
                FloristEoqPolicy.forProduct(spec);

        int demand = generateDemand(spec);

        BigDecimal setupCost = randomRange(
                policy.getMinOrderCost(),
                policy.getMaxOrderCost()
        );

        BigDecimal holdingCost = product.getUnitCost()
                .multiply(BigDecimal.valueOf(policy.getHoldingRate()))
                .setScale(4, RoundingMode.HALF_UP);

        return new EoqMonteCarloSample(
                product.getName(),
                BigInteger.valueOf(demand),
                setupCost,
                holdingCost
        );
    }

    private int generateDemand(FloristProductSpec spec) {
        return switch (spec.getDemandModel()) {
            case NORMAL -> Math.max(
                    (int) Math.round(
                            Normal.normal(
                                    spec.getDemandMeanOrMin(),
                                    spec.getDemandStdOrMax(),
                                    random
                            )
                    ),
                    spec.getDemandMeanOrMin() / 3
            );
            case UNIFORM -> random.nextInt(
                    spec.getDemandStdOrMax()
                            - spec.getDemandMeanOrMin()
            ) + spec.getDemandMeanOrMin();
        };
    }


    private BigDecimal randomRange(double min, double max) {
        double value = min + random.nextDouble() * (max - min);
        return BigDecimal
                .valueOf(value)
                .setScale(2, RoundingMode.HALF_UP);
    }



}
