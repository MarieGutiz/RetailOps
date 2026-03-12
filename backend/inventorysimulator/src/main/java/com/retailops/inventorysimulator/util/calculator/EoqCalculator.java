
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

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.math.MathContext;
import java.math.RoundingMode;

/**
 * Component for calculating the Economic Order Quantity (EOQ).
 *
 * <p>Implements the classical EOQ formula: <code>EOQ = sqrt((2 * D * S) / H)</code>,
 * where D is demand, S is ordering/setup cost, and H is holding cost.
 * Uses high-precision {@link BigDecimal} arithmetic and a Newton-Raphson method for square roots.</p>
 */
@Component
public class EoqCalculator {

    // EOQ = sqrt( (2 * D * S) / H )
    public static BigDecimal calculateEOQ(BigInteger demand,
                                          BigDecimal orderingCost,
                                          BigDecimal holdingCost) {

        MathContext mc = new MathContext(20, RoundingMode.HALF_UP); // higher precision

        // numerator = 2 * D * S
        BigDecimal numerator = new BigDecimal(demand)
                .multiply(orderingCost, mc)
                .multiply(BigDecimal.valueOf(2), mc);

        // denominator = H

        // fraction = numerator / denominator
        BigDecimal fraction = numerator.divide(holdingCost, mc);

        // EOQ = sqrt(fraction) using BigDecimal
        return bigSqrt(fraction, mc).setScale(2, RoundingMode.HALF_UP);
    }

    // Utility: sqrt for BigDecimal (Newton-Raphson)
    private static BigDecimal bigSqrt(BigDecimal value, MathContext mc) {
        BigDecimal x0 = BigDecimal.ZERO;
        BigDecimal x1 = BigDecimal.valueOf(Math.sqrt(value.doubleValue())); // initial guess

        while (!x0.equals(x1)) {
            x0 = x1;
            x1 = value.divide(x0, mc);
            x1 = x1.add(x0);
            x1 = x1.divide(BigDecimal.valueOf(2), mc);
        }
        return x1;
    }
}
