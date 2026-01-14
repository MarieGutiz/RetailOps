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

import com.retailops.inventorysimulator.simulator.dto.AbcItemDto;
import com.retailops.inventorysimulator.simulator.floristshop.abc.analyzer.AbcAnalyzer;
import com.retailops.inventorysimulator.simulator.floristshop.abc.analyzer.AbcRankedItem;

import java.math.BigDecimal;
import java.util.List;

public abstract class AbstractAbcAnalyzer {

    protected BigDecimal totalSales(List<AbcItemDto> items) {
        return items.stream()
                .map(AbcItemDto::getSalesValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    protected List<AbcRankedItem> rank(
            List<AbcItemDto> items,
            BigDecimal totalSales
    ) {
        return AbcAnalyzer.rankItems(items, totalSales);
    }
}
