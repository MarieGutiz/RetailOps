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

/**
 * Utility class for converting Monte Carlo simulation items to ABC analysis DTOs.
 *
 * <p>Provides methods to transform single {@link MonteCarloItemDto} or a list of
 * them into {@link AbcItemDto} instances suitable for ABC simulation.</p>
 */
public class MonteCarloABCMapper {

    public static AbcItemDto toAbcItem(MonteCarloItemDto mcItem) {
        return AbcItemDto.builder()
                .product(mcItem.getProduct())
                .demandFrequency(mcItem.getDemandFrequency())
                .salesValue(mcItem.getSalesValue())
                .build();
    }

    public static List<AbcItemDto> toAbcItems(List<MonteCarloItemDto> mcItems) {
        return mcItems.stream()
                .map(MonteCarloABCMapper::toAbcItem)
                .toList();
    }
}
