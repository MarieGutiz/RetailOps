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

package com.retailops.inventorysimulator.simulator.generator;

import com.retailops.inventorysimulator.util.distribution.Normal;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
public class FloristEOQMonteCarloGenerator implements  MonteCarloGenerator<EoqMonteCarloSample>{
    private final Random random;

    public FloristEOQMonteCarloGenerator() {
        this.random = new Random();
    }

    public FloristEOQMonteCarloGenerator(long seed) {
        this.random = new Random(seed);
    }

    @Override
    public List<EoqMonteCarloSample> generateMonteCarlo() {

        List<EoqMonteCarloSample> items = new ArrayList<>();

        // Fresh flowers → high holding cost (perishable)
        items.add(generateItem(
                "Roses",
                8000, 1800,
                1.5, 3.0,
                15, 30,
                0.55
        ));

        items.add(generateItem(
                "Tulips",
                6000, 1400,
                1.2, 2.5,
                12, 25,
                0.50
        ));

        // Decorative containers → durable goods
        items.add(generateItem(
                "Premium Vase",
                400, 120,
                18, 30,
                40, 70,
                0.18
        ));

        // Consumables / supplies
        items.add(generateItem(
                "Floral Foam",
                12000, 2500,
                0.4, 1.0,
                20, 35,
                0.30
        ));

        items.add(generateItem(
                "Flower Food",
                18000, 3000,
                0.05, 0.15,
                15, 30,
                0.28
        ));

        return items;
    }

    /* =========================
       HELPERS
       ========================= */

    private EoqMonteCarloSample generateItem(
            String name,
            int meanDemand,
            int stdDev,
            double minUnitCost,
            double maxUnitCost,
            double minOrderCost,
            double maxOrderCost,
            double holdingRate
    ) {

        int demand = Math.max(
                (int) Math.round(Normal.normal(meanDemand, stdDev)),
                meanDemand / 3
        );

        BigDecimal unitCost = randomRange(minUnitCost, maxUnitCost);
        BigDecimal setupCost = randomRange(minOrderCost, maxOrderCost);

        BigDecimal holdingCost = unitCost
                .multiply(BigDecimal.valueOf(holdingRate))
                .setScale(4, RoundingMode.HALF_UP);

        return new EoqMonteCarloSample(
                name,
                BigInteger.valueOf(demand),
                setupCost,
                holdingCost
        );
    }

    private BigDecimal randomRange(double min, double max) {
        double value = min + random.nextDouble() * (max - min);
        return BigDecimal.valueOf(value).setScale(2, RoundingMode.HALF_UP);
    }

}
