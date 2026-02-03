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

import com.retailops.inventorysimulator.simulator.dto.EoqResponseDto;
import com.retailops.inventorysimulator.simulator.generator.CafeteriaEOQMonteCarloGenerator;
import com.retailops.inventorysimulator.simulator.generator.EoqMonteCarloSample;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

import static com.retailops.inventorysimulator.util.calculator.EoqCalculator.calculateEOQ;

@Service
@RequiredArgsConstructor
public class CafeteriaSimulationEoqService {
  private final CafeteriaEOQMonteCarloGenerator cafeteriaEOQMonteCarloGenerator;


    public List<EoqResponseDto> runCafeteriaSimulationEoq() {
        //Obtain inventory
       return cafeteriaEOQMonteCarloGenerator
                .generateMonteCarlo()
                .stream()
                .map(this::calculate)
                .toList();
    }

    private EoqResponseDto calculate(EoqMonteCarloSample sample) {
        BigDecimal eoq = calculateEOQ(
                sample.demand(),
                sample.setupCost(),
                sample.holdingCost()
        );

        return new EoqResponseDto(
                sample.productLabel(),
                sample.demand(),
                sample.setupCost(),
                sample.holdingCost(),
                eoq
        );

    }

    }
