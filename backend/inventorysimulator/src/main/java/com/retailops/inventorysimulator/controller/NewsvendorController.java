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


/**
 * REST controller for Newsvendor simulations, providing endpoints to:
 * - Run single or batch simulations
 * - Generate profit distributions and normal PDF histograms
 * - Retrieve key markers (mean demand, order quantity, critical ratio)
 */
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

    /**
     *
     * This endpoint does not perform a full simulation, but instead returns
     * fundamental metrics such as:
     * - Mean demand
     * - Order quantity (Q)
     * - Critical ratio
     *
     * These markers can be used for quick analysis or as inputs for further simulations.
     *
     * @param request contains mean demand, order quantity, and critical ratio
     * @return NewsvendorMarkers object with the calculated markers
     */

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
