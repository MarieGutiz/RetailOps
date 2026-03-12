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

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

/**
 * DTO representing an EOQ cost curve chart, including demand, ordering
 * and holding costs, optimal order quantity, and the chart image in Base64.
 */
@Data
@AllArgsConstructor
public class EoqCostCurveChart {

    private BigDecimal annualDemand;
    private BigDecimal orderingCost;
    private BigDecimal holdingCost;

    private BigDecimal optimalQuantity;

    private String base64Png;
}
