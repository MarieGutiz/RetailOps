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


import com.retailops.inventorysimulator.simulator.dto.EoqCurveResponseDto;
import com.retailops.inventorysimulator.simulator.dto.EoqRequestDto;
import com.retailops.inventorysimulator.simulator.dto.EoqResponseDto;
import com.retailops.inventorysimulator.simulator.service.EoqService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/simulator/eoq")
@RequiredArgsConstructor
public class EoqController {

    private final EoqService eoqService;

    /**
     * Run standard EOQ calculation
     * → returns optimal Q*
     */
    @PostMapping
    public EoqResponseDto simulateEoq(
            @Valid @RequestBody EoqRequestDto request
    ) {
        return eoqService.runEoq(request);
    }

    /**
     * Generate EOQ cost curve
     * → returns ordering cost curve, holding cost curve,
     *    total cost curve + optimal Q*
     */
    @PostMapping("/curve")
    public EoqCurveResponseDto generateCurve(
            @Valid @RequestBody EoqRequestDto request
    ) {

        return eoqService.generateCostCurve(
                request.demand(),
                request.cost(),
                request.holdingCost()
        );
    }

}
