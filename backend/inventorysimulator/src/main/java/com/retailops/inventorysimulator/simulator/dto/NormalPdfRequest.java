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
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

/**
 * Request object for generating a normal probability density function (PDF).
 *
 * <p>Includes the mean, standard deviation, minimum and maximum range, and
 * step size for sampling the distribution.</p>
 */
public record NormalPdfRequest(
        @NotNull
        @DecimalMin(value = "0.0", inclusive = false)
        BigDecimal mean,

        @NotNull
        @DecimalMin(value = "0.0", inclusive = false)
        BigDecimal stdDev,

        @NotNull
        Double min,

        @NotNull
        Double max,

        @NotNull
        @DecimalMin(value = "0.0", inclusive = false)
        Double step
) {
}
