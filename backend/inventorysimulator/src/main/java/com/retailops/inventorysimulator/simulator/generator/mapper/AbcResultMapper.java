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
import com.retailops.inventorysimulator.util.types.ABCCategoryType;

import java.math.BigDecimal;

public class AbcResultMapper {

    public static AbcItemResultDto toItemResult(
            AbcItemDto item,
            int rank,
            BigDecimal cumulativePct,
            ABCCategoryType category
    ) {
        AbcItemResultDto dto = new AbcItemResultDto();

        // Copy the Product object directly
        dto.setProduct(item.getProduct());

        // ABC-specific fields
        dto.setSalesValue(item.getSalesValue());
        dto.setDemandFrequency(item.getDemandFrequency());
        dto.setRank(rank);
        dto.setCumulativePct(cumulativePct);
        dto.setAbcCategoryType(category);

        return dto;
    }
}
