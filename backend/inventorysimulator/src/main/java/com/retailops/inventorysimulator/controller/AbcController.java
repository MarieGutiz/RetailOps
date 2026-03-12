/*
 *
 *  * Copyright (c) 2025
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

import com.retailops.inventorysimulator.simulator.dto.AbcRequestDto;
import com.retailops.inventorysimulator.simulator.dto.AbcResponseDto;
import com.retailops.inventorysimulator.simulator.service.AbcService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


/**
 * REST controller for ABC simulations, providing an endpoint to execute
 * ABC analysis and return items classified into categories A, B, and C.
 */
@RestController
@RequestMapping("/api/simulator/abc")
@RequiredArgsConstructor
public class AbcController {

    private final AbcService abcService;

    /**
     *
     *
     *  Executes an ABC analysis simulation.
     *
     * This endpoint receives the input data required for ABC classification
     * and delegates the computation to the service layer. The result contains
     * items categorized into A, B, and C classes.
     *
     * @param dto -> AbcRequestDto
     * @param simId -> simulation Id
     * @return An ABC analysis - either with classic or multi
     */
    @PostMapping
    public ResponseEntity<AbcResponseDto> runAbc(
            @RequestBody AbcRequestDto dto,
            @RequestParam String simId,
            @RequestParam String shopName) {
        AbcResponseDto response = abcService.runAbc(dto, simId, shopName);
        return ResponseEntity.ok(response);
    }
}
