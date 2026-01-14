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

package com.retailops.inventorysimulator.simulator.generator.mapper;

import com.retailops.inventorysimulator.simulator.dto.AbcItemDto;
import com.retailops.inventorysimulator.simulator.dto.AbcItemResultDto;
import com.retailops.inventorysimulator.util.ABCCategoryType;

import java.math.BigDecimal;

public class AbcResultMapper {

    public static AbcItemResultDto toItemResult(
            AbcItemDto item,
            int rank,
            BigDecimal cumulativePct,
            ABCCategoryType category
    ) {
        AbcItemResultDto dto = new AbcItemResultDto();

        dto.setProductName(item.getProductName());
        dto.setSku(item.getSku());

        dto.setSalesValue(item.getSalesValue());
        dto.setUnitPrice(item.getUnitPrice());
        dto.setUnitCost(item.getUnitCost());

        dto.setRank(rank);
        dto.setCumulativePct(cumulativePct);
        dto.setCategory(category);

        return dto;
    }
}
