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

package com.retailops.inventorysimulator.simulator;

import com.retailops.inventorysimulator.simulator.autogenshop.MonteCarloFactory;
import com.retailops.inventorysimulator.simulator.autogenshop.productcatalog.cafeteria.CafeteriaProductCatalogGenerator;
import com.retailops.inventorysimulator.simulator.autogenshop.productcatalog.florist.FloristProductCatalogGenerator;
import com.retailops.inventorysimulator.simulator.generator.model.newsvendor.NewsvendorMonteCarloGenerator;
import com.retailops.inventorysimulator.util.types.autogen.ShopType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;


public class NewsvendorMonteCarloGeneratorTest {

    private MonteCarloFactory factory;

    @BeforeEach
    void setUp() {
        // Mock dependent catalog generators
        factory = new MonteCarloFactory(
                Mockito.mock(FloristProductCatalogGenerator.class),
                Mockito.mock(CafeteriaProductCatalogGenerator.class)
        );
    }

    @Test
    void testSimulate_deterministicUsingFactory() {
        NewsvendorMonteCarloGenerator generator =
                factory.newsvendor("sim1", "TestShop", ShopType.GENERIC_NEWSVENDOR);

        int orderQuantity = 100;
        BigDecimal meanDemand = BigDecimal.valueOf(80);
        BigDecimal stdDeviation = BigDecimal.valueOf(10);
        BigDecimal price = BigDecimal.valueOf(5);
        BigDecimal cost = BigDecimal.valueOf(3);
        BigDecimal salvageValue = BigDecimal.valueOf(1);
        int simulationRuns = 1000;

        double avgProfit = generator.simulate(
                orderQuantity,
                meanDemand,
                stdDeviation,
                price,
                cost,
                salvageValue,
                simulationRuns
        );

//        double avgProfit = generator.simulate(
//                100,
//                BigDecimal.valueOf(80),
//                BigDecimal.valueOf(10),
//                BigDecimal.valueOf(5),
//                BigDecimal.valueOf(3),
//                BigDecimal.valueOf(1),
//                1000
//        );
//
//        System.out.println(avgProfit); // Copy this value as expectedProfit

        // Deterministic value for the given seed
        double expectedProfit = 120.06633586494183; // <-- compute once and copy
        double tolerance = 0.001;        // allow floating point errors

        assertEquals(expectedProfit, avgProfit, tolerance,
                "Average profit should match deterministic value using factory");
    }


}
