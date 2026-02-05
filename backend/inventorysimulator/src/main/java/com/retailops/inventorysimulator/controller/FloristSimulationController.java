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

package com.retailops.inventorysimulator.controller;


import com.retailops.inventorysimulator.simulator.autogenshop.eoq.service.FloristSimulationEOQService;
import com.retailops.inventorysimulator.simulator.dto.AbcResponseDto;
import com.retailops.inventorysimulator.simulator.autogenshop.abc.service.FloristSimulationAbcService;
import com.retailops.inventorysimulator.simulator.dto.EoqResponseDto;
import com.retailops.inventorysimulator.util.types.SimulationType;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/simulations/florist")
@RequiredArgsConstructor
public class FloristSimulationController {

    private final FloristSimulationAbcService floristSimulationService;
    private final FloristSimulationEOQService  floristSimulationEOQService;

    @GetMapping("/abc")
    public AbcResponseDto runFloristAbc(
            @RequestParam(defaultValue = "ABC_CLASSIC") String mode,
            @RequestParam String simId) {
        try {
            SimulationType simType = SimulationType.fromString(mode);
            return floristSimulationService.runAbc(simType, simId);
        } catch (IllegalArgumentException ex) {
            // This will be caught by GlobalExceptionHandler.handleGeneral
            throw new RuntimeException("Invalid simulation mode: " + mode, ex);
        }
    }

    @GetMapping("/eoq")
    public List<EoqResponseDto> runFloristEOQ(@RequestParam String simId) throws
            Exception {
        return floristSimulationEOQService.runEOQ(simId);
    }

}
