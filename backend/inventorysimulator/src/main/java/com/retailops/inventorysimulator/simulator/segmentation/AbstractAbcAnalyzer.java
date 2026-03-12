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
import com.retailops.inventorysimulator.simulator.autogenshop.abc.analyzer.AbcAnalyzer;
import com.retailops.inventorysimulator.simulator.autogenshop.abc.analyzer.AbcRankedItem;

import java.math.BigDecimal;
import java.util.List;

/**
 * Base class for ABC analyzers providing common utility methods.
 *
 * <p>Includes methods to calculate total sales and to rank items using
 * {@link AbcAnalyzer#rankItems(List, BigDecimal)}, which can be used by
 * concrete ABC analysis strategies.</p>
 */
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
