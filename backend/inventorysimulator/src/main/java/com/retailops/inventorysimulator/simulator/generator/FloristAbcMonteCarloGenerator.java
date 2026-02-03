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
import com.retailops.inventorysimulator.util.SeedFactory;
import com.retailops.inventorysimulator.util.types.autogen.FloristCategoryType;
import com.retailops.inventorysimulator.util.distribution.Normal;
import com.retailops.inventorysimulator.util.types.autogen.FloristProductSpec;
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
public class FloristAbcMonteCarloGenerator  {
    public FloristAbcMonteCarloGenerator() {
        // Stateless: no Random field needed
    }

    /**
     * Generate deterministic inventory for a florist based on simId and shopName
     */
    public List<MonteCarloItemDto> generateInventory(String simId, String shopName) {
        long seed = SeedFactory.catalogSeed(simId, shopName, "FLORIST");
        Random random = new Random(seed);

        List<MonteCarloItemDto> items = new ArrayList<>();
        for (FloristProductSpec spec : FloristProductSpec.values()) {
            items.add(generateFromSpec(spec, random));
        }

        return items;
    }

    /* =========================
       SPEC-DRIVEN GENERATION
       ========================= */

    private MonteCarloItemDto generateFromSpec(FloristProductSpec spec, Random random) {
        return switch (spec.getDemandModel()) {
            case NORMAL -> generateNormalItem(spec, random);
            case UNIFORM -> generateUniformItem(spec, random);
        };
    }

    private MonteCarloItemDto generateNormalItem(FloristProductSpec spec, Random random) {
        int demand = Math.max(
                (int) Math.round(Normal.normal(spec.getDemandMeanOrMin(), spec.getDemandStdOrMax(), random)),
                spec.getDemandMeanOrMin() / 3
        );
        return buildItem(spec, demand, random);
    }

    private MonteCarloItemDto generateUniformItem(FloristProductSpec spec, Random random) {
        int demand = random.nextInt(spec.getDemandStdOrMax() - spec.getDemandMeanOrMin() + 1)
                + spec.getDemandMeanOrMin();
        return buildItem(spec, demand, random);
    }

    /* =========================
       SHARED BUILD LOGIC
       ========================= */

    private MonteCarloItemDto buildItem(FloristProductSpec spec, int demand, Random random) {
        BigDecimal unitCost = randomCost(spec.getMinCost(), spec.getMaxCost(), random);
        BigDecimal unitPrice = unitCost.multiply(BigDecimal.valueOf(spec.getMarkup()))
                .setScale(2, RoundingMode.HALF_UP);
        BigDecimal salesValue = unitPrice.multiply(BigDecimal.valueOf(demand));

        Product product = buildProduct(spec.getName(), spec.getCategory().name(), unitCost, unitPrice);

        MonteCarloItemDto item = new MonteCarloItemDto();
        item.setProduct(product);
        item.setDemandFrequency(BigInteger.valueOf(demand));
        item.setSalesValue(salesValue);
        return item;
    }

    /* =========================
       HELPERS
       ========================= */

    private BigDecimal randomCost(double min, double max, Random random) {
        double value = min + random.nextDouble() * (max - min);
        return BigDecimal.valueOf(value).setScale(2, RoundingMode.HALF_UP);
    }

    private Product buildProduct(String name, String category, BigDecimal unitCost, BigDecimal unitPrice) {
        Product product = new Product();
        product.setName(name);
        product.setSku(buildSku("FLR", name));
        product.setCategory(category);
        product.setUnitCost(unitCost);
        product.setUnitPrice(unitPrice);
        product.setDescription(category + " florist item");
        return product;
    }

}
