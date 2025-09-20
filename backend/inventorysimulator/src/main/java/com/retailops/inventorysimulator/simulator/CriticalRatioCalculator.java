package com.retailops.inventorysimulator.simulator;

import com.retailops.inventorysimulator.model.Product;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class CriticalRatioCalculator {

    public static BigDecimal calculateCriticalRatio(Product product) {
        // Costs
        BigDecimal unitPrice = BigDecimal.valueOf(product.getUnitPrice());
        BigDecimal unitCost = BigDecimal.valueOf(product.getUnitCost());

        BigDecimal Cu = unitPrice.subtract(unitCost); // underage cost
        BigDecimal Co = unitCost;                     // overage cost

        return Cu.divide(Cu.add(Co), 4, RoundingMode.HALF_UP);
    }
}
