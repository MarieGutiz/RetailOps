package com.retailops.inventorysimulator.simulator;

import com.retailops.inventorysimulator.model.Product;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class CriticalRatioCalculator {

    public static BigDecimal calculateCriticalRatio(Product product) {
        // Costs
        BigDecimal unitPrice = product.getUnitPrice();
        BigDecimal unitCost  = product.getUnitCost();

        BigDecimal Cu = unitPrice.subtract(unitCost); // underage cost
        BigDecimal Co = unitCost;                     // overage cost

        // Critical ratio = Cu / (Cu + Co), rounded to 4 decimals
        return Cu.divide(Cu.add(Co), 4, RoundingMode.HALF_UP);
    }
}
