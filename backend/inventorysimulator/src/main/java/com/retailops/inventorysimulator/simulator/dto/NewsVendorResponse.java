package com.retailops.inventorysimulator.simulator.dto;

import java.math.BigDecimal;

public record NewsVendorResponse(String product,
                                 BigDecimal criticalRatio,
                                 int optimalOrderQuantity) {
}
