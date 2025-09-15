package com.retailops.inventorysimulator.simulator;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.math.MathContext;
import java.math.RoundingMode;

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
        BigDecimal denominator = holdingCost;

        // fraction = numerator / denominator
        BigDecimal fraction = numerator.divide(denominator, mc);

        // EOQ = sqrt(fraction) using BigDecimal
        return bigSqrt(fraction, mc).setScale(2, RoundingMode.HALF_UP);
    }

    // Utility: sqrt for BigDecimal (Newton-Raphson)
    private static BigDecimal bigSqrt(BigDecimal value, MathContext mc) {
        BigDecimal x0 = BigDecimal.ZERO;
        BigDecimal x1 = new BigDecimal(Math.sqrt(value.doubleValue())); // initial guess

        while (!x0.equals(x1)) {
            x0 = x1;
            x1 = value.divide(x0, mc);
            x1 = x1.add(x0);
            x1 = x1.divide(BigDecimal.valueOf(2), mc);
        }
        return x1;
    }
}
