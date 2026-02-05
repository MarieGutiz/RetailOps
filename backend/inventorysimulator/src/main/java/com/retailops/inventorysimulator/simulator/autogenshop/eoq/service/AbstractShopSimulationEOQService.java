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

package com.retailops.inventorysimulator.simulator.autogenshop.eoq.service;

import com.retailops.inventorysimulator.simulator.autogenshop.AbstractShopEoqMonteCarloGenerator;
import com.retailops.inventorysimulator.simulator.autogenshop.MonteCarloFactory;
import com.retailops.inventorysimulator.simulator.dto.EoqResponseDto;
import com.retailops.inventorysimulator.simulator.service.EoqService;

import java.util.List;


/**
 * Generic EOQ simulation service for shops.
 * <p>
 * Template:
 * - Create EOQ Monte Carlo generator
 * - Generate EOQ samples
 * - Calculate EOQ results
 */

public abstract class AbstractShopSimulationEOQService <TGenerator extends AbstractShopEoqMonteCarloGenerator<?,?>>{
    protected final MonteCarloFactory factory;
    protected final EoqService eoqService;

    protected AbstractShopSimulationEOQService(
            MonteCarloFactory factory,
            EoqService eoqService
    ) {
        this.factory = factory;
        this.eoqService = eoqService;
    }

    /**
     * Factory hook: create the correct EOQ generator for the shop.
     */
    protected abstract TGenerator createGenerator(String simId);

    /**
     * Template method executed by controllers.
     */
    public List<EoqResponseDto> runEOQ(String simId) {

        TGenerator generator = createGenerator(simId);

        return generator.generate()
                .stream()
                .map(eoqService::calculate)
                .toList();
    }


}
