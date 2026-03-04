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

package com.retailops.inventorysimulator.pdf.dto;

import com.retailops.inventorysimulator.util.types.ABCCategoryType;

import java.math.BigDecimal;
import java.math.BigInteger;

public record AbcItemRow(
        String product,
        String sku,
        ABCCategoryType abcCategory,
        int rank,
        BigDecimal salesValue,
        BigInteger demandFrequency,
        BigDecimal cumulativePct

) {}
