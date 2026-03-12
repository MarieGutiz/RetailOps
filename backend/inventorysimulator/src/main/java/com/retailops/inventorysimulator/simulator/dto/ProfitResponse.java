package com.retailops.inventorysimulator.simulator.dto;


import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.math.BigInteger;

/**
 * Response object for a profit simulation.
 *
 * <p>Includes the product name, stock quantity, demand, and the resulting
 * profit calculated from the simulation.</p>
 */
@Data
@AllArgsConstructor
public class ProfitResponse {
    private String product;
    private BigInteger stockQty;
    private BigInteger demand;
    private BigDecimal profit;

}
