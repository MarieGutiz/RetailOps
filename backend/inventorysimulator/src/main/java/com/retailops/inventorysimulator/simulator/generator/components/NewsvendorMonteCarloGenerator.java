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

package com.retailops.inventorysimulator.simulator.generator.components;

import com.retailops.inventorysimulator.simulator.autogenshop.BaseSeedMonteCarloGenerator;
import com.retailops.inventorysimulator.util.distribution.Normal;
import com.retailops.inventorysimulator.util.types.autogen.ShopType;

import java.math.BigDecimal;

public class NewsvendorMonteCarloGenerator extends BaseSeedMonteCarloGenerator {

    public NewsvendorMonteCarloGenerator(
            String simId,
            String shopName,
            ShopType shopType
    ) {
        super(simId, shopName, shopType);
    }

    public double simulate(
            int orderQuantity,
            BigDecimal meanDemand,
            BigDecimal stdDeviation,
            BigDecimal price,
            BigDecimal cost,
            BigDecimal salvageValue,
            int simulationRuns
    ) {
        double totalProfit = 0.0;

        double mu = meanDemand.doubleValue();//ver
        double sigma = stdDeviation.doubleValue();
        double p = price.doubleValue();
        double c = cost.doubleValue();
        double s = salvageValue.doubleValue();

        for (int i = 0; i < simulationRuns; i++) {

            double demand = Math.max(
                    0.0,
                    Normal.normal(mu, sigma, random)
            );

            double sold = Math.min(orderQuantity, demand);
            double leftover = Math.max(0.0, orderQuantity - demand);

            double profit =
                    sold * p
                            - orderQuantity * c
                            + leftover * s;

            totalProfit += profit;
        }

        return totalProfit / simulationRuns;
    }


}
