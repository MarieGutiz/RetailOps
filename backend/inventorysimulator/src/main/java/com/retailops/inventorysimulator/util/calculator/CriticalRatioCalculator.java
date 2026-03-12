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

/**
 * Component for calculating the critical ratio (CR) in Newsvendor-type inventory models.
 *
 * <p>Provides methods for both basic and advanced CR calculations:
 * <ul>
 *     <li>Basic CR assumes no salvage value and no penalty for unmet demand.</li>
 *     <li>Advanced CR incorporates salvage value and penalty for unmet demand.</li>
 * </ul>
 * The critical ratio represents the probability of stocking enough to meet expected demand
 * and is calculated as CR = CS / (CS + CE), where CS is the underage cost and CE is the overage cost.</p>
 */
@Component
public class CriticalRatioCalculator {

    /**
     * BASIC Critical Ratio
     *
     * Assumptions:
     * - No salvage value
     * - No penalty for unmet demand
     *
     * CS (underage cost) = p - c
     * CE (overage cost)  = c
     *
     * CR = CS / (CS + CE)
     */
    public static BigDecimal calculateBasic(Product product) {
        return calculateBasic(
                product.getUnitPrice(),
                product.getUnitCost()
        );
    }

    public static BigDecimal calculateBasic(
            BigDecimal price,
            BigDecimal cost
    ) {
        BigDecimal underageCost = price.subtract(cost); // CS = p - c
        BigDecimal overageCost  = cost;                 // CE = c

        return criticalRatio(underageCost, overageCost);
    }

    /**
     * ADVANCED Critical Ratio
     *
     * With salvage value and penalty:
     *
     * CS (underage cost) = p - c + B
     * CE (overage cost)  = c - g
     *
     * CR = (p - c + B) / (p + B - g)
     */
    public static BigDecimal calculateAdvanced(
            BigDecimal price,
            BigDecimal cost,
            BigDecimal salvageValue,
            BigDecimal penalty
    ) {
        BigDecimal underageCost = price
                .subtract(cost)
                .add(penalty);          // CS = p - c + B

        BigDecimal overageCost = cost
                .subtract(salvageValue); // CE = c - g

        return criticalRatio(underageCost, overageCost);
    }

    /**
     * Shared CR formula
     */
    private static BigDecimal criticalRatio(
            BigDecimal underageCost,
            BigDecimal overageCost
    ) {
        return underageCost.divide(
                underageCost.add(overageCost),
                4,
                RoundingMode.HALF_UP
        );
    }
}

