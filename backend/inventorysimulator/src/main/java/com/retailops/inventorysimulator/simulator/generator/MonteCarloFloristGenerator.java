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
import com.retailops.inventorysimulator.util.FloristCategoryType;
import com.retailops.inventorysimulator.util.distribution.Normal;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import static com.retailops.inventorysimulator.simulator.segmentation.AbcSummaryBuilder.buildSku;


/**
 * Inventory data was generated using Monte Carlo simulation, where SKU demand follows normal
 * or uniform distributions depending on product role.
 * This ensures realistic variability while preserving reproducibility through fixed random seeds
 *
 * @author Mariela
 */
@Service
public class MonteCarloFloristGenerator implements  MonteCarloGenerator<MonteCarloItemDto> {

    private final Random random;

    public MonteCarloFloristGenerator() {
        this.random = new Random();
    }

    // constructor for testcases
    public MonteCarloFloristGenerator(long seed) {
        this.random = new Random(seed);
    }

    public List<MonteCarloItemDto> generateInventory() {
        List<MonteCarloItemDto> items = new ArrayList<>();

        // Fresh Flowers
        items.add(generateNormalItem(
                "Orchids", FloristCategoryType.FRESH_FLOWERS.name(), 1200, 300, 7, 12, 1.3));
        items.add(generateNormalItem(
                "Proteas", FloristCategoryType.FRESH_FLOWERS.name(), 1000, 250, 8, 14, 1.3));
        items.add(generateNormalItem(
                "Roses", FloristCategoryType.FRESH_FLOWERS.name(), 8000, 1500, 1.5, 3.0, 1.2));
        items.add(generateNormalItem(
                "Tulips", FloristCategoryType.FRESH_FLOWERS.name(), 6000, 1200, 1.2, 2.5, 1.2));

        // Decorative Containers
        items.add(generateNormalItem(
                "Premium Vase", FloristCategoryType.DECORATIVE_CONTAINERS.name(), 400, 120, 18, 30, 1.3));
        items.add(generateNormalItem(
                "Standard Vase", FloristCategoryType.DECORATIVE_CONTAINERS.name(), 2000, 500, 3.0, 6.0, 1.2));

        // Floral Supplies / Plant Care
        items.add(generateUniformItem(
                "Floral Foam", FloristCategoryType.FLORAL_SUPPLIES.name(), 8000, 15000, 0.4, 1.0, 1.1));
        items.add(generateUniformItem(
                "Ribbon", FloristCategoryType.FLORAL_SUPPLIES.name(), 12000, 20000, 0.1, 0.4, 1.1));
        items.add(generateUniformItem(
                "Flower Food", FloristCategoryType.PLANT_CARE_PRODUCTS.name(), 15000, 25000, 0.05, 0.15, 1.1));

        return items;
    }

    /* =========================
       GENERATION HELPERS
       ========================= */

    private MonteCarloItemDto generateNormalItem(
            String name,
            String category,
            int meanDemand,
            int stdDev,
            double minCost,
            double maxCost,
            double markup
    ) {
        int demand = Math.max((int) Math.round(Normal.normal(meanDemand, stdDev)), meanDemand / 3);
        BigDecimal unitCost = randomCost(minCost, maxCost);
        BigDecimal unitPrice = unitCost.multiply(BigDecimal.valueOf(markup))
                .setScale(2, RoundingMode.HALF_UP);
        BigDecimal salesValue = unitPrice.multiply(BigDecimal.valueOf(demand));

        Product product = buildProduct(
                name,
                category,
                unitCost,
                unitPrice
        );

        MonteCarloItemDto item = new MonteCarloItemDto();
        item.setProduct(product);
        item.setDemandFrequency(BigInteger.valueOf(demand));
        item.setSalesValue(salesValue);

        return item;
    }

    // C ITEMS
    /**
     * C-category items are low-value, high-volume consumables.
     * Their demand is modeled using a uniform distribution to reflect
     * irregular, non-seasonal usage where each demand level within
     * a range is equally likely.
     *
     * Unlike A and B items, C items do not exhibit stable demand patterns
     * or strong central tendency, making uniform distribution more
     * appropriate than normal distribution.
     */
    private MonteCarloItemDto generateUniformItem(
            String name,
            String category,
            int minDemand,
            int maxDemand,
            double minCost,
            double maxCost,
            double markup) {

        int demand = random.nextInt(maxDemand - minDemand + 1) + minDemand;
        BigDecimal unitCost = randomCost(minCost, maxCost);
        BigDecimal unitPrice = unitCost.multiply(BigDecimal.valueOf(markup)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal salesValue = unitPrice.multiply(BigDecimal.valueOf(demand));

        Product product = buildProduct(
                name,
                category,
                unitCost,
                unitPrice
        );


        MonteCarloItemDto item = new MonteCarloItemDto();
        item.setProduct(product);
        item.setDemandFrequency(BigInteger.valueOf(demand));
        item.setSalesValue(salesValue);

        return item;
    }

    private BigDecimal randomCost(double min, double max) {
        double value = min + random.nextDouble() * (max - min);
        return BigDecimal.valueOf(value).setScale(2, RoundingMode.HALF_UP);
    }

    private int clampPositive(int value, int min) {
        return Math.max(value, min);
    }

    private Product buildProduct(
            String name,
            String category,
            BigDecimal unitCost,
            BigDecimal unitPrice
    ) {
        Product product = new Product();
        product.setName(name);
        product.setSku(buildSku("FLR", name));
        product.setCategory(category);
        product.setUnitCost(unitCost);
        product.setUnitPrice(unitPrice);
        product.setDescription(category + " florist item");

        return product;
    }



    @Override
    public List<MonteCarloItemDto> generateMonteCarlo() {
        return generateInventory();
    }


}
