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


/**
 *
 * Generates synthetic inventory data for a cafeteria using Monte Carlo simulation.
 *
 * Annual demand, setup cost, and holding cost parameters are stochastically sampled
 * to reflect realistic operational uncertainty in food service environments.
 * Demand is modeled using normal distributions centered around expected yearly
 * consumption, while cost parameters are drawn from bounded uniform ranges
 * to simulate supplier price variability and ordering policies.
 * <p>
 * This generator produces abstract EOQ input samples independent of any persisted
 * product entities. A dedicated adapter layer is responsible for binding simulated
 * samples to concrete products within the system.
 * <p>
 * Reproducibility of experiments is supported through optional fixed random seeds,
 * enabling deterministic test cases and comparative analysis.
 * @author Mariela
 */
@Service
public class CafeteriaEOQMonteCarloGenerator implements  MonteCarloGenerator<EoqMonteCarloSample> {

    private final Random random;

    public CafeteriaEOQMonteCarloGenerator() {
        this.random = new Random();
    }

    public CafeteriaEOQMonteCarloGenerator(long seed) {
        this.random = new Random(seed);
    }

    @Override
    public List<EoqMonteCarloSample> generateMonteCarlo() {
        List<EoqMonteCarloSample> items = new ArrayList<>();

        items.add(generateItem("Coffee Beans", 3600, 300, 16, 22, 40, 60, 0.25));
        items.add(generateItem("Milk", 18000, 1500, 0.7, 1.1, 20, 30, 0.30));
        items.add(generateItem("Cups", 50000, 3000, 0.04, 0.08, 15, 25, 0.15));
        items.add(generateItem("Sugar", 2000, 200, 0.6, 0.9, 25, 35, 0.20));

        return items;
    }

    private EoqMonteCarloSample generateItem(
            String name,
            int meanDemand,
            int stdDev,
            double minUnitCost,
            double maxUnitCost,
            double minOrderCost,
            double maxOrderCost,
            double holdingRate) {

        int demand = Math.max(
                (int) Math.round(Normal.normal(meanDemand, stdDev)),
                meanDemand / 2
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
