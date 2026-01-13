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


import com.retailops.inventorysimulator.simulator.generator.EoqMonteCarloSample;
import com.retailops.inventorysimulator.simulator.generator.MonteCarloCafeteriaGenerator;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@Slf4j
@SpringBootTest
public class MonteCarloCafeteriaGeneratorTest {

    @Autowired
    private MonteCarloCafeteriaGenerator generator;


    @BeforeEach
    void setup() {
        generator = new MonteCarloCafeteriaGenerator(42L); // deterministic
    }

    @Test
    void cafeteriaGenerator_shouldProduceStableInventory() {
        List<EoqMonteCarloSample> samples = generator.generateMonteCarlo();

        assertThat(samples).hasSize(4);

        samples.forEach(sample -> {
            assertThat(sample.productLabel()).isNotBlank();

            assertThat(sample.demand())
                    .isNotNull()
                    .isGreaterThan(BigInteger.ZERO);

            assertThat(sample.setupCost())
                    .isNotNull()
                    .isGreaterThan(BigDecimal.ZERO);

            assertThat(sample.holdingCost())
                    .isNotNull()
                    .isGreaterThan(BigDecimal.ZERO);
        });
    }

    @Test
    void cafeteriaGenerator_shouldProduceReasonableEOQValues() {
        List<EoqMonteCarloSample> samples = generator.generateMonteCarlo();

        for (EoqMonteCarloSample sample : samples) {
            BigDecimal eoq = calculateEOQ(
                    sample.demand(),
                    sample.setupCost(),
                    sample.holdingCost()
            );

            assertThat(eoq)
                    .isNotNull()
                    .isGreaterThan(BigDecimal.ZERO);
        }
    }

    /**
     * EOQ = sqrt((2 * D * S) / H)
     */
    private BigDecimal calculateEOQ(
            BigInteger demand,
            BigDecimal setupCost,
            BigDecimal holdingCost) {

        BigDecimal numerator = setupCost
                .multiply(BigDecimal.valueOf(2))
                .multiply(new BigDecimal(demand));

        BigDecimal ratio = numerator.divide(
                holdingCost, 8, BigDecimal.ROUND_HALF_UP
        );

        return BigDecimal.valueOf(Math.sqrt(ratio.doubleValue()))
                .setScale(2, BigDecimal.ROUND_HALF_UP);
    }

    @Test
    void shouldGenerateCafeteriaMonteCarloSamples() {
        MonteCarloCafeteriaGenerator generator =
                new MonteCarloCafeteriaGenerator(42L);

        List<EoqMonteCarloSample> samples = generator.generateMonteCarlo();

        assertThat(samples).isNotEmpty();

        samples.forEach(sample ->
                log.info("Generated EOQ sample: {}", sample)
        );
    }

}
