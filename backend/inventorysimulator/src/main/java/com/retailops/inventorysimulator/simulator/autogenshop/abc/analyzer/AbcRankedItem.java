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

package com.retailops.inventorysimulator.simulator.autogenshop.abc.analyzer;

import com.retailops.inventorysimulator.simulator.dto.AbcItemDto;
import com.retailops.inventorysimulator.util.types.ABCCategoryType;

import java.math.BigDecimal;

/**
 * Represents an item ranked in ABC analysis.
 *
 * <p>Contains the original item data, its rank, cumulative contribution
 * percentage, and its ABC category (A, B, or C).</p>
 */
public record AbcRankedItem(
        AbcItemDto item,
        int rank,
        BigDecimal cumulativePct,
        ABCCategoryType abcCategoryType//A, B, or C category
) {
}
