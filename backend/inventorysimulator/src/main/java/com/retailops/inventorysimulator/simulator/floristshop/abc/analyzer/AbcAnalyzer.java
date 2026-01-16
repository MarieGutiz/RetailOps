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

package com.retailops.inventorysimulator.simulator.floristshop.abc.analyzer;

import com.retailops.inventorysimulator.model.ABCResult;
import com.retailops.inventorysimulator.simulator.dto.AbcItemDto;
import com.retailops.inventorysimulator.simulator.dto.AbcRequestDto;
import com.retailops.inventorysimulator.simulator.segmentation.AbcAnalyzerStrategy;
import com.retailops.inventorysimulator.util.ABCCategoryType;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class AbcAnalyzer {
    public static List<AbcRankedItem> rankItems(
            List<AbcItemDto> items,
            BigDecimal totalSales
    ) {
        List<AbcRankedItem> rankedItems = new ArrayList<>();

        BigDecimal cumulative = BigDecimal.ZERO;
        int rank = 1;

        for (AbcItemDto item : items) {
            cumulative = cumulative.add(item.getSalesValue());

            BigDecimal cumulativePct = cumulative
                    .divide(totalSales, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));

            ABCCategoryType category =
                    cumulativePct.compareTo(AbcAnalyzerStrategy.CLASS_A) <= 0
                            ? ABCCategoryType.A
                            : cumulativePct.compareTo(AbcAnalyzerStrategy.CLASS_B) <= 0
                            ? ABCCategoryType.B
                            : ABCCategoryType.C;

            rankedItems.add(
                    new AbcRankedItem(item, rank++, cumulativePct, category)
            );
        }

        return rankedItems;
    }

    public static List<ABCResult> getAbcResults(
            AbcRequestDto requestDto,
            List<AbcRankedItem> rankedItems
    ) {
        List<ABCResult> results = new ArrayList<>();

        for (AbcRankedItem ranked : rankedItems) {

            ABCResult result = new ABCResult();
            result.setProductName(ranked.item().getProduct().getName());
            result.setAbcClass(ranked.abcCategoryType());
            result.setContributionPercentage(ranked.cumulativePct());
            result.setRank(ranked.rank());
            result.setUsername(requestDto.username());
            result.setAnalyzedAt(LocalDateTime.now());

            results.add(result);
        }

        return results;
    }

}
