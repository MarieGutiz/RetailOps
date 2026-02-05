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


import com.retailops.inventorysimulator.simulator.autogenshop.productcatalog.cafeteria.CafeteriaEOQMonteCarloGenerator;
import com.retailops.inventorysimulator.simulator.autogenshop.productcatalog.cafeteria.CafeteriaProductCatalogGenerator;
import com.retailops.inventorysimulator.simulator.generator.EoqMonteCarloSample;
import com.retailops.inventorysimulator.util.types.autogen.CafeteriaProductSpec;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.util.List;

import static com.retailops.inventorysimulator.util.calculator.EoqCalculator.calculateEOQ;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class CafeteriaEOQMonteCarloGeneratorTest {

    private static final String SIM_ID = "SIM-CAFETERIA-EOQ-001";
    private static final String SHOP_NAME = "Cafeteria";

    @Autowired
    private CafeteriaProductCatalogGenerator catalog;

    @Test
    void shouldBeDeterministicAcrossGeneratorInstances() {

        CafeteriaEOQMonteCarloGenerator gen1 =
                new CafeteriaEOQMonteCarloGenerator(
                        SIM_ID,
                        SHOP_NAME,
                        catalog
                );

        CafeteriaEOQMonteCarloGenerator gen2 =
                new CafeteriaEOQMonteCarloGenerator(
                        SIM_ID,
                        SHOP_NAME,
                        catalog
                );

        List<EoqMonteCarloSample> firstRun = gen1.generate();
        List<EoqMonteCarloSample> secondRun = gen2.generate();

        assertThat(firstRun)
                .usingRecursiveComparison()
                .isEqualTo(secondRun);
    }

    @Test
    void cafeteriaGenerator_shouldProduceStableInventory() {

        CafeteriaEOQMonteCarloGenerator generator =
                new CafeteriaEOQMonteCarloGenerator(
                        SIM_ID,
                        SHOP_NAME,
                        catalog
                );

        List<EoqMonteCarloSample> samples = generator.generate();

        assertThat(samples)
                .hasSize(CafeteriaProductSpec.values().length);

        samples.forEach(sample -> {
            assertThat(sample.productLabel()).isNotBlank();
            assertThat(sample.demand()).isPositive();
            assertThat(sample.setupCost()).isPositive();
            assertThat(sample.holdingCost()).isPositive();
        });
    }

    @Test
    void cafeteriaGenerator_shouldProduceReasonableEOQValues() {

        CafeteriaEOQMonteCarloGenerator generator =
                new CafeteriaEOQMonteCarloGenerator(
                        SIM_ID,
                        SHOP_NAME,
                        catalog
                );

        List<EoqMonteCarloSample> samples = generator.generate();

        samples.forEach(sample -> {
            BigDecimal eoq = calculateEOQ(
                    sample.demand(),
                    sample.setupCost(),
                    sample.holdingCost()
            );

            assertThat(eoq).isPositive();
        });
    }

    @Test
    void differentSimId_shouldProduceDifferentSamples() {

        CafeteriaEOQMonteCarloGenerator gen1 =
                new CafeteriaEOQMonteCarloGenerator(
                        "SIM-1",
                        SHOP_NAME,
                        catalog
                );

        CafeteriaEOQMonteCarloGenerator gen2 =
                new CafeteriaEOQMonteCarloGenerator(
                        "SIM-2",
                        SHOP_NAME,
                        catalog
                );

        assertThat(gen1.generate())
                .isNotEqualTo(gen2.generate());
    }


}
