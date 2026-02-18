package com.retailops.inventorysimulator.simulator.dto;

import java.math.BigDecimal;
import java.math.BigInteger;

public record EoqResponseDto(
        String product,
        BigInteger demand,
        BigDecimal setupCost,
        BigDecimal holdingCost,
        BigDecimal eoq,
        BigDecimal orderingCost,
        BigDecimal holdingCostTotal,
        BigDecimal totalCost,
        BigDecimal numberOfOrders,
        BigDecimal cycleTime
)
{
}
