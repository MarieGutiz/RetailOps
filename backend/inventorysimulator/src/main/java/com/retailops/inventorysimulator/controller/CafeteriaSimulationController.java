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

import com.retailops.inventorysimulator.simulator.autogenshop.eoq.service.CafeteriaSimulationEoqService;
import com.retailops.inventorysimulator.simulator.dto.AbcResponseDto;
import com.retailops.inventorysimulator.simulator.autogenshop.abc.service.CafeteriaSimulationAbcService;
import com.retailops.inventorysimulator.simulator.dto.EoqResponseDto;
import com.retailops.inventorysimulator.util.types.SimulationType;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST controller for cafeteria simulations, providing endpoints to run
 * ABC and EOQ analyses for cafeteria products and return the simulation results.
 */
@RestController
@RequestMapping("/api/simulations/cafeteria")
@RequiredArgsConstructor
public class CafeteriaSimulationController {
    public final CafeteriaSimulationAbcService cafeteriaSimulationService;
    public final CafeteriaSimulationEoqService  cafeteriaSimulationEoqService;

    @GetMapping("/abc")
    public AbcResponseDto runCafeteriaAbc(
            @RequestParam(defaultValue = "ABC_CLASSIC") String mode,
            @RequestParam String simId) {
        try {
            SimulationType simType = SimulationType.fromString(mode);
            return cafeteriaSimulationService.runAbc(simType, simId);
        }catch (IllegalArgumentException ex) {
            // This will be caught by GlobalExceptionHandler.handleGeneral
            throw new RuntimeException("Invalid simulation mode: " + mode, ex);
        }
    }

    @GetMapping("/eoq")
    public List<EoqResponseDto> runCafeteriaEoq(@RequestParam String simId) throws
            Exception {
        return  cafeteriaSimulationEoqService.runEOQ(simId);

    }

}
