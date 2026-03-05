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

import com.retailops.inventorysimulator.model.Account;
import com.retailops.inventorysimulator.simulator.autogenshop.productcatalog.florist.FloristAbcMonteCarloGenerator;
import com.retailops.inventorysimulator.simulator.autogenshop.MonteCarloFactory;
import com.retailops.inventorysimulator.simulator.service.AbcService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FloristSimulationAbcService
        extends AbstractShopSimulationAbcService<FloristAbcMonteCarloGenerator>  {


    public FloristSimulationAbcService(
            MonteCarloFactory factory,
            AbcService abcService
    ) {
        super(factory, abcService);
    }

    @Override
    protected FloristAbcMonteCarloGenerator createGenerator(String simId) {
        // Factory already knows how to wire a florist ABC generator
        return factory.abcFlorist(simId, "Florist");
    }

    @Override
    protected Account getDemoName() {

        // Lightweight Account for demo/autogen, not persisted
        return Account.builder()
                .username("florist-demo")
                .name("Florist Demo")
                .email("demo@florist.local")
                .build();
    }

}
