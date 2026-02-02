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

import com.retailops.inventorysimulator.simulator.dto.AbcItemDto;
import com.retailops.inventorysimulator.simulator.dto.AbcRequestDto;
import com.retailops.inventorysimulator.simulator.dto.AbcResponseDto;
import com.retailops.inventorysimulator.simulator.dto.MonteCarloItemDto;
import com.retailops.inventorysimulator.simulator.generator.CafeteriaAbcMonteCarloGenerator;
import com.retailops.inventorysimulator.simulator.generator.mapper.MonteCarloABCMapper;
import com.retailops.inventorysimulator.simulator.service.AbcService;
import com.retailops.inventorysimulator.util.types.SimulationType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CafeteriaSimulationAbcService {
    private final CafeteriaAbcMonteCarloGenerator generatorCaf;
    private final AbcService abcService;


    public AbcResponseDto runCafeteriaAbc(SimulationType mode) {

        // 1. Generate cafeteria inventory (Monte Carlo)
        List<MonteCarloItemDto> inventory = generatorCaf.generateInventory();

        // 2. Map Monte Carlo items to ABC input items
        List<AbcItemDto> abcItems = MonteCarloABCMapper.toAbcItems(inventory);

        // 3. Build ABC request
        AbcRequestDto request = new AbcRequestDto(
                abcItems,
                "cafeteria-demo",
                mode
        );

        // 4. Run ABC simulation (no DB persistence required)
        return abcService.runAbcsim(request);
    }

}
