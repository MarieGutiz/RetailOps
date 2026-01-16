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
import com.retailops.inventorysimulator.simulator.floristshop.abc.analyzer.AbcRankedItem;
import com.retailops.inventorysimulator.util.SimulationType;

import java.math.BigDecimal;
import java.util.List;

public interface AbcAnalyzerStrategy {
    static final BigDecimal CLASS_A = BigDecimal.valueOf(80);
    static final BigDecimal CLASS_B = BigDecimal.valueOf(95);

    List<AbcRankedItem> analyze(AbcRequestDto requestDto);
    SimulationType getType();
}
