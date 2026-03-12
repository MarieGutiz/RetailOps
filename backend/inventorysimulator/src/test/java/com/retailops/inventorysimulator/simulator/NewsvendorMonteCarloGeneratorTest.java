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

/**
 * Unit tests for the Newsvendor Monte Carlo generator.
 *
 * <p>This test class verifies deterministic and reproducible behavior
 * of the {@link NewsvendorMonteCarloGenerator} when instantiated
 * via the {@link MonteCarloFactory}.</p>
 *
 * <p>Specifically, it ensures that:</p>
 * <ul>
 *   <li>Simulations produce consistent average profit results for a given
 *       simulation ID and seed.</li>
 *   <li>Floating-point tolerances are handled correctly to allow minor
 *       numerical differences.</li>
 * </ul>
 *
 * <p>The tests validate correctness and reproducibility of Monte Carlo
 * simulations for Newsvendor inventory scenarios across repeated runs.</p>
 */
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


        // Deterministic value for the given seed
        double expectedProfit = 120.06633586494183; // <-- compute once and copy
        double tolerance = 0.001;        // allow floating point errors

        assertEquals(expectedProfit, avgProfit, tolerance,
                "Average profit should match deterministic value using factory");
    }


}
