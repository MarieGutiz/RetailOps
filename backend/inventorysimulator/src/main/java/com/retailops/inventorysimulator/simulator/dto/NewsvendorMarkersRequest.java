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

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.math.BigInteger;

public record NewsvendorMarkersRequest(
        @NotBlank
        String simId,

        @NotNull
        @DecimalMin(value = "0.0", inclusive = false)
        BigDecimal meanDemand,

        @Min(0)
        BigInteger orderQuantity,

        @NotNull
        @DecimalMin(value = "0.0", inclusive = false)
        BigDecimal criticalRatio
) {
}
