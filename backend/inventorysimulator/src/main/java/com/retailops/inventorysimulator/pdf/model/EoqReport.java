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

package com.retailops.inventorysimulator.pdf.model;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;


/**
 * Report DTO for EOQ analysis, summarizing optimal order quantity, total annual cost,
 * ordering and holding costs, number of orders per year, and cycle time.
 */
@EqualsAndHashCode(callSuper = true)
@Data
public class EoqReport extends BaseReport {

    private BigDecimal optimalQuantity;
    private BigDecimal totalAnnualCost;
    private BigDecimal orderingCost;
    private BigDecimal holdingCost;
    private BigDecimal numberOfOrdersPerYear;
    private BigDecimal cycleTime;

}
