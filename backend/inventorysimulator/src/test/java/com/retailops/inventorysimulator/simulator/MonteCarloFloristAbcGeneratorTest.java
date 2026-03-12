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

import com.retailops.inventorysimulator.model.Product;
import com.retailops.inventorysimulator.simulator.autogenshop.productcatalog.florist.FloristAbcMonteCarloGenerator;
import com.retailops.inventorysimulator.simulator.autogenshop.productcatalog.florist.FloristProductCatalogGenerator;
import com.retailops.inventorysimulator.simulator.dto.MonteCarloItemDto;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigInteger;
import java.util.List;
import java.util.Random;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Integration tests for the Florist ABC Monte Carlo generator.
 *
 * <p>This test class verifies the deterministic and stochastic behavior
 * of the {@link FloristAbcMonteCarloGenerator} used for florist inventory
 * simulations. It ensures that:</p>
 * <ul>
 *   <li>Generators with the same simulation ID produce identical inventory samples.</li>
 *   <li>Generators with different simulation IDs produce distinct inventory samples.</li>
 *   <li>The generated inventory size matches the underlying product catalog size.</li>
 *   <li>All demand frequency values in the generated inventory are non-negative.</li>
 * </ul>
 *
 * <p>The tests help guarantee reproducibility, correctness, and validity
 * of Monte Carlo simulations for florist ABC inventory modeling.</p>
 */
@SpringBootTest
class FloristAbcMonteCarloGeneratorTest {

    private static final String TEST_SIM_ID = "SIM-FLORIST-ABC-001";
    private static final String SHOP_NAME = "Florist";

    @Autowired
    private FloristProductCatalogGenerator catalogGenerator;

    @Test
    void shouldBeDeterministicAcrossDifferentGeneratorInstances() {
        FloristAbcMonteCarloGenerator gen1 =
                new FloristAbcMonteCarloGenerator(TEST_SIM_ID, SHOP_NAME, catalogGenerator);
        FloristAbcMonteCarloGenerator gen2 =
                new FloristAbcMonteCarloGenerator(TEST_SIM_ID, SHOP_NAME, catalogGenerator);

        List<MonteCarloItemDto> firstRun = gen1.generateInventory();
        List<MonteCarloItemDto> secondRun = gen2.generateInventory();

        assertThat(firstRun)
                .usingRecursiveComparison()
                .isEqualTo(secondRun);
    }

    @Test
    void differentSimId_shouldProduceDifferentSamples() {
        FloristAbcMonteCarloGenerator gen1 =
                new FloristAbcMonteCarloGenerator("SIM-1", SHOP_NAME, catalogGenerator);
        FloristAbcMonteCarloGenerator gen2 =
                new FloristAbcMonteCarloGenerator("SIM-2", SHOP_NAME, catalogGenerator);

        List<MonteCarloItemDto> inventory1 = gen1.generateInventory();
        List<MonteCarloItemDto> inventory2 = gen2.generateInventory();

        assertThat(inventory1).isNotEqualTo(inventory2);
    }

    @Test
    void inventorySize_shouldMatchCatalogSize() {
        FloristAbcMonteCarloGenerator generator =
                new FloristAbcMonteCarloGenerator(TEST_SIM_ID, SHOP_NAME, catalogGenerator);

        List<MonteCarloItemDto> inventory = generator.generateInventory();
        List<Product> catalog = catalogGenerator.generateCatalog(new Random(TEST_SIM_ID.hashCode()));

        assertThat(inventory).hasSize(catalog.size());
    }

    @Test
    void allDemandValues_shouldBeNonNegative() {
        FloristAbcMonteCarloGenerator generator =
                new FloristAbcMonteCarloGenerator(TEST_SIM_ID, SHOP_NAME, catalogGenerator);

        List<MonteCarloItemDto> inventory = generator.generateInventory();

        assertThat(inventory)
                .allSatisfy(item -> assertThat(item.getDemandFrequency())
                        .isGreaterThanOrEqualTo(BigInteger.ZERO));
    }

}
