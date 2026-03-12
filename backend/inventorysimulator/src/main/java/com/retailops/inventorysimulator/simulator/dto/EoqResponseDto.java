package com.retailops.inventorysimulator.simulator.dto;

import java.math.BigDecimal;
import java.math.BigInteger;

/**
 * Response object for an EOQ (Economic Order Quantity) simulation.
 *
 * <p>Contains the product details, input parameters (demand, setup cost, holding cost),
 * and the calculated EOQ results including order quantity, costs, number of orders,
 * and cycle time.</p>
 */
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
