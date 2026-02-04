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

package com.retailops.inventorysimulator.simulator.autogenshop.abc.service;

import com.retailops.inventorysimulator.simulator.autogenshop.productcatalog.AbstractShopMonteCarloGenerator;
import com.retailops.inventorysimulator.simulator.autogenshop.productcatalog.MonteCarloFactory;
import com.retailops.inventorysimulator.simulator.dto.AbcItemDto;
import com.retailops.inventorysimulator.simulator.dto.AbcRequestDto;
import com.retailops.inventorysimulator.simulator.dto.AbcResponseDto;
import com.retailops.inventorysimulator.simulator.dto.MonteCarloItemDto;
import com.retailops.inventorysimulator.simulator.generator.mapper.MonteCarloABCMapper;
import com.retailops.inventorysimulator.simulator.service.AbcService;
import com.retailops.inventorysimulator.util.types.SimulationType;

import java.util.List;

public abstract class AbstractShopSimulationAbcService<TGenerator extends AbstractShopMonteCarloGenerator<?>> {

    protected MonteCarloFactory factory;  // injected

    protected AbcService abcService;      // injected

    /**
     * Run the ABC simulation for a specific shop.
     *
     * The workflow:
     * 1. Get a Monte Carlo generator from the factory (already tied to simId/shop)
     * 2. Generate inventory via the generator
     * 3. Map Monte Carlo items to ABC items
     * 4. Build ABC request and run simulation
     *
     * @param mode  simulation type
     * @param simId simulation identifier
     * @return ABC response
     */
    public AbcResponseDto runAbc(SimulationType mode, String simId) {

        // 1. Create generator from factory
        TGenerator generator = createGenerator(simId);

        // 2. Generate inventory (Monte Carlo generator handles catalog internally)
        List<MonteCarloItemDto> inventory = generator.generateInventory();

        // 3. Map Monte Carlo items to ABC input
        List<AbcItemDto> abcItems = MonteCarloABCMapper.toAbcItems(inventory);

        // 4. Build ABC request and run simulation
        AbcRequestDto request = new AbcRequestDto(
                abcItems,
                getDemoName(),
                mode
        );

        return abcService.runAbcsim(request);
    }

    /** Concrete subclasses provide the generator from factory */
    protected abstract TGenerator createGenerator(String simId);

    /** Concrete subclasses provide shop-specific demo name */
    protected abstract String getDemoName();

}
