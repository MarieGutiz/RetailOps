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

package com.retailops.inventorysimulator.simulator.dto;

import java.math.BigDecimal;

/**
 * Represents a single point on an EOQ (Economic Order Quantity) cost curve.
 *
 * <p>Includes the order quantity, associated ordering cost, holding cost,
 * and total cost for that quantity.</p>
 */
public record EoqCurvePointDto(
        BigDecimal quantity,
        BigDecimal orderingCost,
        BigDecimal holdingCost,
        BigDecimal totalCost
) {
}
