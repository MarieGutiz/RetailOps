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

package com.retailops.inventorysimulator.simulator.floristshop.abc.service;

import com.retailops.inventorysimulator.simulator.dto.AbcItemDto;
import com.retailops.inventorysimulator.simulator.dto.AbcRequestDto;
import com.retailops.inventorysimulator.simulator.dto.AbcResponseDto;
import com.retailops.inventorysimulator.simulator.dto.MonteCarloItemDto;
import com.retailops.inventorysimulator.simulator.generator.MonteCarloFloristGenerator;
import com.retailops.inventorysimulator.simulator.generator.mapper.MonteCarloABCMapper;
import com.retailops.inventorysimulator.simulator.service.AbcService;
import com.retailops.inventorysimulator.util.SimulationType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FloristSimulationService {

    private final MonteCarloFloristGenerator generator;
    private final AbcService abcService;

    public AbcResponseDto runFloristAbc(SimulationType mode) {

        // 1. Generate florist inventory (Monte Carlo)
        List<MonteCarloItemDto> inventory = generator.generateInventory();

        // 2. Map Monte Carlo items to ABC input items
        List<AbcItemDto> abcItems = MonteCarloABCMapper.toAbcItems(inventory);

        // 3. Build ABC request
        AbcRequestDto request = new AbcRequestDto(
                abcItems,
                "florist-demo",
                mode
        );

        // 4. Run ABC simulation (no DB persistence required)
        return abcService.runAbcsim(request);
    }

}
