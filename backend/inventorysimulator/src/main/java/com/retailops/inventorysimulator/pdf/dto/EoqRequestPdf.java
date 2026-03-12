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
import java.math.BigInteger;

/**
 * DTO for generating an EOQ PDF report, containing the annual demand,
 * setup cost, and holding cost for the product simulation.
 */
@SuperBuilder
@Jacksonized
@Getter
@Setter
@ToString(callSuper = true)
public class EoqRequestPdf extends ProductSimulationRequest {

    @NotNull(message = "Annual demand (D) is required")
    @Positive(message = "Annual demand must be greater than 0")
    private BigDecimal demand;

    @NotNull(message = "Setup cost (S) is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Setup cost must be greater than 0")
    private BigDecimal cost;

    @NotNull(message = "Holding cost (H) is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Holding cost must be greater than 0")
    private BigDecimal holdingCost;

}
