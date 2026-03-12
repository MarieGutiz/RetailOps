/*
 *
 *  * Copyright (c) 2025
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

import com.retailops.inventorysimulator.simulator.dto.AbcRequestDto;
import com.retailops.inventorysimulator.simulator.autogenshop.abc.analyzer.AbcRankedItem;
import com.retailops.inventorysimulator.util.types.SimulationType;

import java.math.BigDecimal;
import java.util.List;

/**
 * Strategy interface for ABC analysis algorithms.
 *
 * <p>Defines the contract for analyzing items and assigning ABC categories.
 * Provides thresholds for classic ABC categorization (CLASS_A = 80%, CLASS_B = 95%).</p>
 */
public interface AbcAnalyzerStrategy {
    static final BigDecimal CLASS_A = BigDecimal.valueOf(80);
    static final BigDecimal CLASS_B = BigDecimal.valueOf(95);

    List<AbcRankedItem> analyze(AbcRequestDto requestDto);
    SimulationType getType();
}
