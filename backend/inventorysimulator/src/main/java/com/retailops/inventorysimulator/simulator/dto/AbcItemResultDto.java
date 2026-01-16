package com.retailops.inventorysimulator.simulator.dto;

import com.retailops.inventorysimulator.model.Product;
import com.retailops.inventorysimulator.util.ABCCategoryType;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@RequiredArgsConstructor
public class AbcItemResultDto {
    // Product identity
    private Product product; // replaces productName, sku, description, productCategory

    // Commercial data
    private BigDecimal salesValue;

    // ABC analysis result
    private int rank;
    private BigDecimal cumulativePct;
    private ABCCategoryType abcCategoryType; // "A", "B", "C"
}
