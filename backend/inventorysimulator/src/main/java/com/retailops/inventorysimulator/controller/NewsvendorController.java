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


import com.retailops.inventorysimulator.simulator.dto.*;
import com.retailops.inventorysimulator.simulator.service.NewsvendorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/simulator/newsvendor")
@RequiredArgsConstructor
public class NewsvendorController {

    private final NewsvendorService newsvendorService;

    @PostMapping
    public NewsvendorResponse simulateNewsvendor(
            @Valid @RequestBody NewsvendorRequest request,
            @RequestParam String simId,
            @RequestParam String shopName) {
        return newsvendorService.simulate(request, simId, shopName);
    }

    /**
     *
     * @param request
     * @param simId
     * @param shopName
     * @param minQ
     * @param maxQ
     * @return batchSimulation → Q vs expected profit
     */
    @PostMapping("/batch")
    public Map<Integer, Double> batchSimulation(
            @RequestBody NewsvendorRequest request,
            @RequestParam String simId,
            @RequestParam String shopName,
            @RequestParam int minQ,
            @RequestParam int maxQ
    ) {
        return newsvendorService.simulateBatch(request, simId, shopName, minQ, maxQ);
    }

    /**
     *
     * @param request
     * @param simId
     * @return profitBell → histogram for a fixed Q
     */
    @PostMapping("/pdf")
    public Map<Double, Double> normalPdf(
            @Valid @RequestBody NormalPdfRequest request,
            @RequestParam String simId
    ) {
        return newsvendorService.normalPDF(
                request.mean(),
                request.stdDev(),
                request.min(),
                request.max(),
                request.step(),
                simId
        );
    }

    /**
     *
     * @param request
     * @param orderQuantity
     * @param simId
     * @param shopName
     * @return  Returns a profit frequency distribution (histogram) for a fixed order quantity Q*.
     */
    @PostMapping("/profit-distribution")
    public ProfitDistributionResult profitDistribution(
            @Valid @RequestBody NewsvendorRequest request,
            @RequestParam int orderQuantity,
            @RequestParam String simId,
            @RequestParam String shopName
    ) {
        return newsvendorService.profitDistribution(
                request,
                orderQuantity,
                simId,
                shopName
        );
    }

    @PostMapping("/markers")
    public NewsvendorMarkers markers(
            @Valid @RequestBody NewsvendorMarkersRequest request
    ) {
        return new NewsvendorMarkers(
                request.meanDemand(),
                request.orderQuantity(),
                request.criticalRatio()
        );
    }

}
