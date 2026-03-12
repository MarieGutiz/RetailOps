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
import java.math.BigInteger;

/**
 * Represents key parameters for the Newsvendor model.
 *
 * <p>Includes the mean demand, recommended order quantity, and the critical ratio
 * used for determining optimal stock levels under uncertain demand.</p>
 */
public record NewsvendorMarkers(
        BigDecimal meanDemand,
        BigInteger orderQuantity,
        BigDecimal criticalRatio

) {
}
