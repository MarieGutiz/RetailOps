/*
 *
 *  * Copyright (c) 2026
 *  * Author: Mariela Paola Gutierrez
 *  * Repository: https://github.com/mariegutiz
 *  *
 *  * Licensed under the MIT License. You may obtain a copy of the License at:
 *  *     https://opensource.org/licenses/MIT
 *  *
 *  *
 *  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 *
 *
 */

package com.retailops.inventorysimulator.simulator.generator;

import com.retailops.inventorysimulator.model.Product;
import com.retailops.inventorysimulator.simulator.dto.MonteCarloItemDto;
import com.retailops.inventorysimulator.util.types.autogen.CafeteriaCategoryType;
import com.retailops.inventorysimulator.util.distribution.Normal;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import static com.retailops.inventorysimulator.simulator.segmentation.AbcSummaryBuilder.buildSku;

@Service
public class CafeteriaAbcMonteCarloGenerator {
    private final Random random = new Random();

    public List<MonteCarloItemDto> generateInventory() {
        List<MonteCarloItemDto> items = new ArrayList<>();

        items.add(normalItem(
                "Coffee Beans",
                CafeteriaCategoryType.BEVERAGES,
                3600, 300,
                16, 22,
                1.4
        ));

        items.add(normalItem(
                "Milk",
                CafeteriaCategoryType.DAIRY,
                18000, 1500,
                0.7, 1.1,
                1.3
        ));

        // C-like items
        items.add(uniformItem(
                "Cups",
                CafeteriaCategoryType.CONSUMABLES,
                40000, 60000,
                0.04, 0.08,
                1.2
        ));

        items.add(uniformItem(
                "Sugar",
                CafeteriaCategoryType.INGREDIENTS,
                1800, 2400,
                0.6, 0.9,
                1.2
        ));

        return items;
    }

    /* =========================
       HELPERS
       ========================= */

    private MonteCarloItemDto normalItem(
            String name,
            CafeteriaCategoryType category,
            int mean,
            int stdDev,
            double minCost,
            double maxCost,
            double markup
    ) {
        int demand = Math.max(
                (int) Math.round(Normal.normal(mean, stdDev)),
                mean / 2
        );

        return buildItem(name, category.name(), demand, minCost, maxCost, markup);
    }

    private MonteCarloItemDto uniformItem(
            String name,
            CafeteriaCategoryType category,
            int minDemand,
            int maxDemand,
            double minCost,
            double maxCost,
            double markup
    ) {
        int demand = random.nextInt(maxDemand - minDemand + 1) + minDemand;

        return buildItem(name, category.name(), demand, minCost, maxCost, markup);
    }

    private MonteCarloItemDto buildItem(
            String name,
            String category,
            int demand,
            double minCost,
            double maxCost,
            double markup
    ) {
        BigDecimal unitCost = randomCost(minCost, maxCost);
        BigDecimal unitPrice = unitCost
                .multiply(BigDecimal.valueOf(markup))
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal salesValue =
                unitPrice.multiply(BigDecimal.valueOf(demand));

        Product product = new Product();
        product.setName(name);
        product.setSku(buildSku("CAF", name));
        product.setCategory(category);
        product.setUnitCost(unitCost);
        product.setUnitPrice(unitPrice);
        product.setDescription(category + " cafeteria item");

        MonteCarloItemDto dto = new MonteCarloItemDto();
        dto.setProduct(product);
        dto.setDemandFrequency(BigInteger.valueOf(demand));
        dto.setSalesValue(salesValue);

        return dto;
    }

    private BigDecimal randomCost(double min, double max) {
        double value = min + random.nextDouble() * (max - min);
        return BigDecimal.valueOf(value).setScale(2, RoundingMode.HALF_UP);
    }

}
