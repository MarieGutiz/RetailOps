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

package com.retailops.inventorysimulator.simulator.segmentation;

import com.retailops.inventorysimulator.simulator.dto.AbcItemResultDto;
import com.retailops.inventorysimulator.simulator.dto.AbcSummaryDto;
import com.retailops.inventorysimulator.util.ABCCategoryType;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

public class AbcSummaryBuilder {

    public static AbcSummaryDto build(List<AbcItemResultDto> items) {

        BigDecimal totalValue = items.stream()
                .map(AbcItemResultDto::getSalesValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        AbcSummaryDto dto = new AbcSummaryDto();
        dto.setTotalValue(totalValue);

        dto.setA(buildCategory(items, ABCCategoryType.A, totalValue));
        dto.setB(buildCategory(items, ABCCategoryType.B, totalValue));
        dto.setC(buildCategory(items, ABCCategoryType.C, totalValue));

        return dto;
    }

    private static AbcSummaryDto.CategorySummary buildCategory(
            List<AbcItemResultDto> items,
            ABCCategoryType category,
            BigDecimal totalValue
    ) {
        List<AbcItemResultDto> filtered =
                items.stream()
                        .filter(i -> i.getCategory() == category)
                        .toList();

        BigDecimal valueSum =
                filtered.stream()
                        .map(AbcItemResultDto::getSalesValue)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

        AbcSummaryDto.CategorySummary cs =
                new AbcSummaryDto.CategorySummary();

        cs.setCount(filtered.size());
        cs.setValuePct(
                totalValue.signum() == 0
                        ? BigDecimal.ZERO
                        : valueSum
                        .divide(totalValue, 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100))
        );

        return cs;
    }
}
