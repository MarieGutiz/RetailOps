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

import com.retailops.inventorysimulator.model.Product;
import com.retailops.inventorysimulator.simulator.generator.dto.EoqMonteCarloSample;
import com.retailops.inventorysimulator.util.distribution.Normal;
import com.retailops.inventorysimulator.util.types.autogen.DemandModel;
import com.retailops.inventorysimulator.util.types.autogen.ShopType;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.math.RoundingMode;
import java.util.List;

/**
 * Generic EOQ Monte Carlo generator for shops.
 * <p>
 * Template for EOQ simulations:
 * - Generate deterministic catalog
 * - Generate stochastic demand
 * - Apply EOQ policy (setup & holding costs)
 */
public abstract class AbstractShopEoqMonteCarloGenerator <TSpec, TPolicy>
        extends BaseSeedMonteCarloGenerator {

    protected AbstractShopEoqMonteCarloGenerator(
            String simId,
            String shopName,
            ShopType shopType
    ) {
        super(simId, shopName, shopType);
    }

    /* -------------------------
       Template hooks
       ------------------------- */

    protected abstract List<Product> getCatalog();

    protected abstract TSpec resolveSpec(Product product);

    protected abstract TPolicy resolvePolicy(TSpec spec);

    protected abstract DemandModel getDemandModel(TSpec spec);

    protected abstract int getDemandMeanOrMin(TSpec spec);

    protected abstract int getDemandStdOrMax(TSpec spec);

    protected abstract double getHoldingRate(TPolicy policy);

    protected abstract double getMinOrderCost(TPolicy policy);

    protected abstract double getMaxOrderCost(TPolicy policy);

    /* -------------------------
       Template method
       ------------------------- */

    public List<EoqMonteCarloSample> generate() {

        List<Product> products = getCatalog();

        return products.stream()
                .map(this::toEoqSample)
                .toList();
    }

    /* -------------------------
       Shared mechanics
       ------------------------- */

    private EoqMonteCarloSample toEoqSample(Product product) {

        TSpec spec = resolveSpec(product);
        TPolicy policy = resolvePolicy(spec);

        int demand = generateDemand(spec);

        BigDecimal setupCost = randomRange(
                getMinOrderCost(policy),
                getMaxOrderCost(policy)
        );

        BigDecimal holdingCost = product.getUnitCost()
                .multiply(BigDecimal.valueOf(getHoldingRate(policy)))
                .setScale(4, RoundingMode.HALF_UP);

        return new EoqMonteCarloSample(
                product.getName(),
                BigInteger.valueOf(demand),
                setupCost,
                holdingCost
        );
    }

    protected int generateDemand(TSpec spec) {
        return switch (getDemandModel(spec)) {
            case NORMAL -> Math.max(
                    (int) Math.round(
                            Normal.normal(
                                    getDemandMeanOrMin(spec),
                                    getDemandStdOrMax(spec),
                                    random
                            )
                    ),
                    getDemandMeanOrMin(spec) / 3
            );
            case UNIFORM -> random.nextInt(
                    getDemandStdOrMax(spec)
                            - getDemandMeanOrMin(spec) + 1
            ) + getDemandMeanOrMin(spec);
        };
    }

    protected BigDecimal randomRange(double min, double max) {
        double value = min + random.nextDouble() * (max - min);
        return BigDecimal
                .valueOf(value)
                .setScale(2, RoundingMode.HALF_UP);
    }

}
