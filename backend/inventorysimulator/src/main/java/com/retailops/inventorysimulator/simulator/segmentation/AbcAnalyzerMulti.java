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

package com.retailops.inventorysimulator.simulator.segmentation;

import com.retailops.inventorysimulator.model.ABCResult;
import com.retailops.inventorysimulator.simulator.dto.AbcItemDto;
import com.retailops.inventorysimulator.simulator.dto.AbcRequestDto;
import com.retailops.inventorysimulator.util.SimulationType;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

import static com.retailops.inventorysimulator.simulator.AbcAnalyzer.getAbcResults;

public class AbcAnalyzerMulti implements AbcAnalyzerStrategy {
    @Override
    public List<ABCResult> analyze(AbcRequestDto requestDto) {
        List<AbcItemDto> items = new ArrayList<>(requestDto.items());

        BigDecimal totalSales = items.stream()
                .map(AbcItemDto::getSalesValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigInteger totalDemand = items.stream()
                .map(AbcItemDto::getDemandFrequency)
                .reduce(BigInteger.ZERO, BigInteger::add);

        // sort by weighted score
        items.sort((i1, i2) -> weightedScore(i2, totalSales, totalDemand)
                .compareTo(weightedScore(i1, totalSales, totalDemand)));

        return getAbcResults(requestDto, items, totalSales);
    }



    private BigDecimal weightedScore(AbcItemDto item,
                                     BigDecimal totalSales,
                                     BigInteger totalDemand) {
        BigDecimal salesShare = item.getSalesValue()
                .divide(totalSales, 6, RoundingMode.HALF_UP);
        BigDecimal demandShare = new BigDecimal(item.getDemandFrequency())
                .divide(new BigDecimal(totalDemand), 6, RoundingMode.HALF_UP);

        return salesShare.multiply(BigDecimal.valueOf(0.7))
                .add(demandShare.multiply(BigDecimal.valueOf(0.3)));
    }

    @Override
    public SimulationType getType() {
        return SimulationType.ABC_MULTI;
    }
}
