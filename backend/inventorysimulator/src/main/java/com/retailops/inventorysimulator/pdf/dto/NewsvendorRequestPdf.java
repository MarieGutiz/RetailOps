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

package com.retailops.inventorysimulator.pdf.dto;


import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;
import lombok.extern.jackson.Jacksonized;

import java.math.BigDecimal;

@SuperBuilder
@Jacksonized
@Getter
@Setter
@ToString(callSuper = true)
public class NewsvendorRequestPdf extends ProductSimulationRequest{

    @NotNull(message = "Mean demand is required")
    @Positive(message = "Mean demand must be greater than 0")
    private Double meanDemand;

    @NotNull(message = "Standard deviation is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Standard deviation must be greater than 0")
    private Double stdDeviation;

    @NotNull(message = "Selling price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Selling price must be greater than 0")
    private BigDecimal price;

    @NotNull(message = "Purchase cost is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Purchase cost must be greater than 0")
    private BigDecimal cost;

    @NotNull(message = "Salvage value is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Salvage value cannot be negative")
    private BigDecimal salvageValue;

    @NotNull(message = "Penalty is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Penalty cannot be negative")
    private BigDecimal penalty;


}
