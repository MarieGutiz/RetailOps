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

package com.retailops.inventorysimulator.simulator;

import com.retailops.inventorysimulator.model.ABCResult;
import com.retailops.inventorysimulator.model.Product;
import com.retailops.inventorysimulator.simulator.dto.AbcItemDto;
import com.retailops.inventorysimulator.simulator.dto.AbcRequestDto;
import com.retailops.inventorysimulator.simulator.dto.MonteCarloItemDto;
import com.retailops.inventorysimulator.simulator.autogenshop.abc.analyzer.AbcAnalyzer;
import com.retailops.inventorysimulator.simulator.autogenshop.abc.analyzer.AbcRankedItem;
import com.retailops.inventorysimulator.simulator.generator.FloristAbcMonteCarloGenerator;
import com.retailops.inventorysimulator.simulator.generator.mapper.MonteCarloABCMapper;
import com.retailops.inventorysimulator.simulator.segmentation.AbcAnalyzerClassic;
import com.retailops.inventorysimulator.simulator.segmentation.AbcAnalyzerMulti;
import com.retailops.inventorysimulator.util.types.ABCCategoryType;
import com.retailops.inventorysimulator.util.types.SimulationType;
import com.retailops.inventorysimulator.util.types.autogen.FloristProductSpec;
import jakarta.annotation.Nonnull;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.math.RoundingMode;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@Slf4j
@SpringBootTest
public class MonteCarloFloristAbcGeneratorTest {

    private static final String TEST_SIM_ID = "SIM-FLORIST-ABC-001";
    private static final String SHOP_NAME = "Florist";

    @Autowired
    private FloristAbcMonteCarloGenerator generator;

    private AbcAnalyzerClassic classicAnalyzer;
    private AbcAnalyzerMulti multiAnalyzer;

    @BeforeEach
    void setup() {
        classicAnalyzer = new AbcAnalyzerClassic();
        multiAnalyzer = new AbcAnalyzerMulti();
    }

    @Test
    void floristGenerator_shouldBeDeterministicForSameSimId() {
        List<MonteCarloItemDto> firstRun = generator.generateInventory(TEST_SIM_ID, SHOP_NAME);
        List<MonteCarloItemDto> secondRun = generator.generateInventory(TEST_SIM_ID, SHOP_NAME);

        assertThat(firstRun)
                .usingRecursiveComparison()
                .isEqualTo(secondRun);
    }

    @Test
    void floristGenerator_shouldProduceStableInventory() {
        List<MonteCarloItemDto> items = generator.generateInventory(TEST_SIM_ID, SHOP_NAME);
        assertThat(items).hasSize(FloristProductSpec.values().length);

        assertThat(items).allSatisfy(item -> {
            Product p = item.getProduct();
            assertThat(p).isNotNull();
            assertThat(p.getName()).isNotBlank();
            assertThat(p.getSku()).isNotBlank();
            assertThat(p.getUnitPrice()).isGreaterThan(p.getUnitCost());
        });
    }

    @Test
    void classicABC_shouldProduceValidClassicDistribution() {
        AbcRequestDto request = getAbcRequestDto();
        List<AbcRankedItem> ranked = classicAnalyzer.analyze(request);
        List<ABCResult> results = AbcAnalyzer.getAbcResults(request, ranked);

        results.forEach(MonteCarloFloristAbcGeneratorTest::extracted);

        // Strongest item is first
        assertThat(results.get(0).getProductName()).isEqualTo("Rose Bouquet");

        // Weakest item is last and C
        ABCResult last = results.get(results.size() - 1);
        assertThat(last.getProductName()).isEqualTo("Orchid Pot");
        assertThat(last.getAbcClass()).isEqualTo(ABCCategoryType.C);

        // ABC classes are monotonic
        assertThat(results.stream().map(ABCResult::getAbcClass).toList())
                .isSortedAccordingTo(Enum::compareTo);

        // More than one class exists
        assertThat(results.stream().map(ABCResult::getAbcClass).distinct().count())
                .isGreaterThan(1);
    }

    @Test
    void multiABC_shouldReorderComparedToClassic() {
        List<MonteCarloItemDto> mcItems = generator.generateInventory(TEST_SIM_ID, SHOP_NAME);
        List<AbcItemDto> items = MonteCarloABCMapper.toAbcItems(mcItems);

        AbcRequestDto classicRequest = new AbcRequestDto(items, "test-user", SimulationType.ABC_CLASSIC);
        AbcRequestDto multiRequest = new AbcRequestDto(items, "test-user", SimulationType.ABC_MULTI);

        List<AbcRankedItem> classicRankedItems = classicAnalyzer.analyze(classicRequest);
        List<AbcRankedItem> multiRankedItems = multiAnalyzer.analyze(multiRequest);

        List<ABCResult> classicResults = AbcAnalyzer.getAbcResults(classicRequest, classicRankedItems);
        List<ABCResult> multiResults = AbcAnalyzer.getAbcResults(multiRequest, multiRankedItems);

        log.info("Classic ABC Results:");
        classicResults.forEach(MonteCarloFloristAbcGeneratorTest::extracted);

        log.info("Multi ABC Results:");
        multiResults.forEach(MonteCarloFloristAbcGeneratorTest::extracted);

        assertThat(classicResults.stream().map(ABCResult::getProductName).toList())
                .isNotEqualTo(multiResults.stream().map(ABCResult::getProductName).toList());
    }

    @Test
    void shouldGenerateFloristInventoryWithAllCategories() {
        List<MonteCarloItemDto> items = generator.generateInventory(TEST_SIM_ID, SHOP_NAME);
        assertThat(items).isNotEmpty();

        items.forEach(item -> {
            Product p = item.getProduct();
            log.info("Florist item: {} [{}] | Category: {} | Demand: {} | Sales: {}",
                    p.getName(), p.getSku(), p.getCategory(),
                    item.getDemandFrequency(), item.getSalesValue());
            assertThat(p.getCategory()).isNotBlank();
        });
    }

    private static void extracted(ABCResult r) {
        log.info("Product: {}, ABC: {}", r.getProductName(), r.getAbcClass());
    }

    @Nonnull
    private static AbcRequestDto getAbcRequestDto() {
        List<AbcItemDto> items = List.of(
                abcItem("Rose Bouquet", "RB001", BigDecimal.valueOf(1000.0), BigInteger.valueOf(10)),
                abcItem("Lily Bundle", "LB001", BigDecimal.valueOf(100.0), BigInteger.valueOf(7)),
                abcItem("Tulip Bunch", "TB001", BigDecimal.valueOf(80.0), BigInteger.valueOf(8)),
                abcItem("Orchid Pot", "OP001", BigDecimal.valueOf(40.0), BigInteger.valueOf(4))
        );
        return new AbcRequestDto(items, "test-user", SimulationType.ABC_CLASSIC);
    }

    private static AbcItemDto abcItem(String name, String sku, BigDecimal unitCost, BigInteger demand) {
        Product product = new Product();
        product.setName(name);
        product.setSku(sku);
        product.setCategory("Test Category");
        product.setUnitCost(unitCost);
        BigDecimal unitPrice = unitCost.multiply(BigDecimal.valueOf(1.2)).setScale(2, RoundingMode.HALF_UP);
        product.setUnitPrice(unitPrice);
        BigDecimal salesValue = unitPrice.multiply(new BigDecimal(demand));

        return AbcItemDto.builder()
                .product(product)
                .demandFrequency(demand)
                .salesValue(salesValue)
                .build();
    }
}
