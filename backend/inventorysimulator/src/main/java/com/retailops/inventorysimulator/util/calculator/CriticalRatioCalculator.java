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

package com.retailops.inventorysimulator.util.calculator;

import com.retailops.inventorysimulator.model.Product;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Component
public class CriticalRatioCalculator {

    public static BigDecimal calculateCriticalRatio(Product product) {
        // Costs
        BigDecimal unitPrice = product.getUnitPrice();
        BigDecimal unitCost  = product.getUnitCost();

        BigDecimal Cu = unitPrice.subtract(unitCost); // underage cost
        BigDecimal Co = unitCost;                     // overage cost

        // Critical ratio = Cu / (Cu + Co), rounded to 4 decimals
        return Cu.divide(Cu.add(Co), 4, RoundingMode.HALF_UP);
    }

    public BigDecimal calculate(
            BigDecimal price,
            BigDecimal cost,
            BigDecimal salvageValue
    ) {
        BigDecimal Cu = price.subtract(cost);          // underage cost
        BigDecimal Co = cost.subtract(salvageValue);   // overage cost

        return Cu.divide(
                Cu.add(Co),
                4,
                RoundingMode.HALF_UP
        );
    }
}
