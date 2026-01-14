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
import com.retailops.inventorysimulator.simulator.dto.MonteCarloItemDto;

import java.util.List;


public class MonteCarloABCMapper {

    public static AbcItemDto toAbcItem(MonteCarloItemDto mcItem) {
        AbcItemDto dto = new AbcItemDto();
        dto.setProductName(mcItem.getProductName());
        dto.setSku(mcItem.getSku());
        dto.setDemandFrequency(mcItem.getDemandFrequency());
        dto.setSalesValue(mcItem.getSalesValue());
        dto.setUnitCost(mcItem.getUnitCost());
        dto.setUnitPrice(mcItem.getUnitPrice());
        return dto;
    }

    public static List<AbcItemDto> toAbcItems(List<MonteCarloItemDto> mcItems) {
        return mcItems.stream().map(MonteCarloABCMapper::toAbcItem).toList();
    }
}
