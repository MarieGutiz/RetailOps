package com.retailops.inventorysimulator.simulator.dto;

import java.math.BigDecimal;
import java.math.BigInteger;

public record NewsvendorResponse(String product,
                                 BigDecimal criticalRatio,
                                 BigInteger optimalOrderQuantity,
                                 BigDecimal expectedProfit,
                                 BigDecimal serviceLevel) {
}
