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

package com.retailops.inventorysimulator.transfer;

import com.retailops.inventorysimulator.util.types.SimulationType;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDateTime;

public record SimulationRunDTO(
        Long id,
        SimulationType simulationType,
        String productName,
        BigInteger stockQty,
        BigInteger demand,
        BigDecimal profit,
        LocalDateTime runAt,
        AccountDTO account  // now safe DTO instead of entity
) {}
