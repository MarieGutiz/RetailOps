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

import com.retailops.inventorysimulator.simulator.dto.AbcItemDto;
import com.retailops.inventorysimulator.simulator.dto.AbcRequestDto;
import com.retailops.inventorysimulator.simulator.autogenshop.abc.analyzer.AbcRankedItem;
import com.retailops.inventorysimulator.util.types.SimulationType;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

/**
 * Multi-factor ABC analyzer that ranks items using a weighted combination of sales and demand.
 *
 * <p>Implements {@link AbcAnalyzerStrategy} and {@link AbstractAbcAnalyzer} to
 * calculate a weighted score for each item (70% sales value, 30% demand frequency),
 * sort items by this score, and assign ABC categories (A, B, C).</p>
 */
@Component
public class AbcAnalyzerMulti extends AbstractAbcAnalyzer implements AbcAnalyzerStrategy {

    @Override
    public List<AbcRankedItem> analyze(AbcRequestDto requestDto) {
        List<AbcItemDto> items = new ArrayList<>(requestDto.items());

        BigDecimal totalSales = totalSales(items);
        BigInteger totalDemand = items.stream()
                .map(AbcItemDto::getDemandFrequency)
                .reduce(BigInteger.ZERO, BigInteger::add);

        items.sort((i1, i2) ->
                weightedScore(i2, totalSales, totalDemand)
                        .compareTo(
                                weightedScore(i1, totalSales, totalDemand)
                        )
        );

//        // Log for verification
//        System.out.println("Multi Analyzer: ranking by weighted sales+demand");
//        items.forEach(i -> System.out.println(i.getProduct().getName() +
//                " -> sales:" + i.getSalesValue() +
//                " demand:" + i.getDemandFrequency() +
//                " weighted:" + weightedScore(i, totalSales, totalDemand)
//        ));

        return rank(items, totalSales);
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
