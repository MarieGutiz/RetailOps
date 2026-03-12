package com.retailops.inventorysimulator.simulator.dto;

import com.retailops.inventorysimulator.model.Product;
import com.retailops.inventorysimulator.util.types.ABCCategoryType;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.math.BigInteger;

/**
 * Data transfer object representing the result of ABC analysis for a single item.
 *
 * <p>Includes product details, commercial metrics (sales value, demand frequency),
 * and ABC-specific results such as rank, cumulative percentage, and category type.</p>
 */
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
    private BigInteger demandFrequency;
}
