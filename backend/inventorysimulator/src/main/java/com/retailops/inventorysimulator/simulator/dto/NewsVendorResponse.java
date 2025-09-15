package com.retailops.inventorysimulator.simulator.dto;

import java.math.BigDecimal;
import java.math.BigInteger;

public record NewsVendorResponse(String product,
                                 BigDecimal criticalRatio,
                                 BigInteger optimalOrderQuantity) {
}
