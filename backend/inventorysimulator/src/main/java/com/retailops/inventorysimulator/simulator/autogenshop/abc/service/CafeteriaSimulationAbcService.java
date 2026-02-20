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

import com.retailops.inventorysimulator.simulator.autogenshop.AbstractShopEoqMonteCarloGenerator;
import com.retailops.inventorysimulator.simulator.autogenshop.MonteCarloFactory;
import com.retailops.inventorysimulator.simulator.autogenshop.productcatalog.cafeteria.CafeteriaAbcMonteCarloGenerator;
import com.retailops.inventorysimulator.simulator.autogenshop.productcatalog.florist.FloristAbcMonteCarloGenerator;
import com.retailops.inventorysimulator.simulator.dto.AbcItemDto;
import com.retailops.inventorysimulator.simulator.dto.AbcRequestDto;
import com.retailops.inventorysimulator.simulator.dto.AbcResponseDto;
import com.retailops.inventorysimulator.simulator.dto.MonteCarloItemDto;
import com.retailops.inventorysimulator.simulator.generator.mapper.MonteCarloABCMapper;
import com.retailops.inventorysimulator.simulator.service.AbcService;
import com.retailops.inventorysimulator.util.types.SimulationType;
import com.retailops.inventorysimulator.util.types.autogen.CafeteriaEoqPolicy;
import com.retailops.inventorysimulator.util.types.autogen.CafeteriaProductSpec;
import com.retailops.inventorysimulator.util.types.autogen.ShopType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CafeteriaSimulationAbcService extends
        AbstractShopSimulationAbcService<CafeteriaAbcMonteCarloGenerator> {



    public CafeteriaSimulationAbcService(
            MonteCarloFactory factory,
            AbcService abcService
    ) {
        super(factory, abcService);
    }


    @Override
    protected CafeteriaAbcMonteCarloGenerator createGenerator(String simId) {
        return factory.abcCafeteria(simId, ShopType.CAFETERIA.toString());
    }

    @Override
    protected String getDemoName() {
        return "cafeteria-demo";
    }



}
