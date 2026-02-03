/*
 * Copyright (c) 2025. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package com.retailops.inventorysimulator.simulator;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.math.BigInteger;

import static com.retailops.inventorysimulator.util.calculator.EoqCalculator.calculateEOQ;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class EoqCalculatorTest {

    @Test
    void testSmallValues() {
        // EOQ = sqrt((2 * D * S) / H)
        BigInteger demand = BigInteger.valueOf(1000);      // D = 1000
        BigDecimal orderingCost = BigDecimal.valueOf(50);  // S = 50
        BigDecimal holdingCost = BigDecimal.valueOf(5);    // H = 5

        BigDecimal eoq = calculateEOQ(demand, orderingCost, holdingCost);

        // Expected = sqrt((2*1000*50)/5) = sqrt(20000) ≈ 141.42
        assertEquals(BigDecimal.valueOf(141.42), eoq);
    }

    @Test
    void testMediumValues() {
        BigInteger demand = BigInteger.valueOf(1_000_000); // D = 1,000,000
        BigDecimal orderingCost = BigDecimal.valueOf(200); // S = 200
        BigDecimal holdingCost = BigDecimal.valueOf(10);   // H = 10

        BigDecimal eoq = calculateEOQ(demand, orderingCost, holdingCost);

        // Expected = sqrt((2*1,000,000*200)/10) = sqrt(40,000,000) ≈ 6324.56
        assertEquals(BigDecimal.valueOf(6324.56), eoq);
    }

    @Test
    void testHugeDemand() {
        BigInteger demand = new BigInteger("1000000000000"); // 1 trillion
        BigDecimal orderingCost = BigDecimal.valueOf(500);   // S = 500
        BigDecimal holdingCost = BigDecimal.valueOf(25);     // H = 25

        BigDecimal eoq = calculateEOQ(demand, orderingCost, holdingCost);

        // Just check scale + positivity, since the value is huge
        assertTrue(eoq.compareTo(BigDecimal.ZERO) > 0);
        assertEquals(2, eoq.scale()); // 2 decimal places
    }
}
