package com.retailops.inventorysimulator.simulator.dto;

import com.retailops.inventorysimulator.util.ABCCategoryType;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@RequiredArgsConstructor
public class AbcItemResultDto {
    private String productName;
    private String sku;

    private BigDecimal salesValue;
    private BigDecimal unitPrice;
    private BigDecimal unitCost;

    private int rank;
    private BigDecimal cumulativePct;
    private ABCCategoryType category; // "A", "B", "C"
}
