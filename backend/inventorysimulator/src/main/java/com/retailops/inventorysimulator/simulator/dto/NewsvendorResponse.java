package com.retailops.inventorysimulator.simulator.dto;

import java.math.BigDecimal;
import java.math.BigInteger;

/**
 * Response object for a Newsvendor simulation.
 *
 * <p>Includes the product name, critical ratio, calculated optimal order quantity,
 * expected profit, and achieved service level.</p>
 */
public record NewsvendorResponse(String product,
                                 BigDecimal criticalRatio,
                                 BigInteger optimalOrderQuantity,
                                 BigDecimal expectedProfit,
                                 BigDecimal serviceLevel) {
}
