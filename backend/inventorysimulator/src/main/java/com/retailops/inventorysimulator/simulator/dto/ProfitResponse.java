package com.retailops.inventorysimulator.simulator.dto;


import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.math.BigInteger;

@Data
@AllArgsConstructor
public class ProfitResponse {
    private String product;
    private BigInteger stockQty;
    private BigInteger demand;
    private BigDecimal profit;

}
