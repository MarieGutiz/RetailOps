package com.retailops.inventorysimulator.simulator.dto;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProfitResponse {
    private String product;
    private int stockQty;
    private int demand;
    private double profit;

}
