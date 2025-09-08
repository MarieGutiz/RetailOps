package com.retailops.inventorysimulator.simulator.dto;

import lombok.Data;

@Data
public class ProfitRequest {
    private Long productId;
    private int stockQty;
    private int demand;
    private boolean saveToHistory;
    private String username;
}
