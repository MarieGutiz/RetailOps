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

import com.retailops.inventorysimulator.simulator.autogenshop.productcatalog.florist.FloristEOQMonteCarloGenerator;
import com.retailops.inventorysimulator.simulator.autogenshop.productcatalog.MonteCarloFactory;
import com.retailops.inventorysimulator.simulator.dto.EoqResponseDto;
import com.retailops.inventorysimulator.simulator.service.EoqService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FloristSimulationEoqService {

    private final MonteCarloFactory factory;
    private final EoqService  eoqService;

    public List<EoqResponseDto> runFloristEOQ(String simId) {
        // 1. Create generator for THIS request
        FloristEOQMonteCarloGenerator generator =
                factory.eoq(simId, "Florist");

         return  generator
                 .generate()
                 .stream()
                 .map(eoqService :: calculate)
                 .toList();
    }
}
