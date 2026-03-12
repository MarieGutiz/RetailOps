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
import java.math.BigInteger;


/**
 * Report DTO for Newsvendor analysis, including optimal order quantity,
 * expected profit, service level, and stockout probability.
 */
@EqualsAndHashCode(callSuper = true)
@Data
public class NewsvendorReport extends BaseReport{

    private BigInteger optimalQuantity;
    private BigDecimal expectedProfit;
    private BigDecimal serviceLevel;
    private BigDecimal stockoutProbability;

}
