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
import com.retailops.inventorysimulator.simulator.floristshop.abc.analyzer.AbcAnalyzer;
import com.retailops.inventorysimulator.simulator.floristshop.abc.analyzer.AbcRankedItem;
import com.retailops.inventorysimulator.simulator.generator.MonteCarloFloristGenerator;
import com.retailops.inventorysimulator.simulator.generator.mapper.MonteCarloABCMapper;
import com.retailops.inventorysimulator.simulator.segmentation.AbcAnalyzerClassic;
import com.retailops.inventorysimulator.simulator.segmentation.AbcAnalyzerMulti;
import com.retailops.inventorysimulator.util.ABCCategoryType;
import com.retailops.inventorysimulator.util.SimulationType;
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

    @Autowired
    private MonteCarloFloristGenerator generator;
    private AbcAnalyzerClassic classicAnalyzer;
    private AbcAnalyzerMulti multiAnalyzer;

    @BeforeEach
    void setup() {
        generator = new MonteCarloFloristGenerator(42L); // fixed seed
        classicAnalyzer = new AbcAnalyzerClassic();
        multiAnalyzer = new AbcAnalyzerMulti();
    }

    @Test
    void floristGenerator_shouldProduceStableInventory() {
        List<MonteCarloItemDto> items = generator.generateMonteCarlo();

        assertThat(items).hasSize(9);

        assertThat(items)
                .allSatisfy(item -> {
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

        // 1. Strongest item is first
        assertThat(results)
                .first()
                .extracting(ABCResult::getProductName)
                .isEqualTo("Rose Bouquet");

        // 2. Weakest item is last and C
        assertThat(results)
                .last()
                .satisfies(r -> {
                    assertThat(r.getProductName()).isEqualTo("Orchid Pot");
                    assertThat(r.getAbcClass()).isEqualTo(ABCCategoryType.C);
                });

        // 3. ABC classes are monotonic
        assertThat(results)
                .extracting(ABCResult::getAbcClass)
                .isSortedAccordingTo(Enum::compareTo);

        // 4. More than one class exists
        assertThat(
                results.stream()
                        .map(ABCResult::getAbcClass)
                        .distinct()
                        .count()
        ).isGreaterThan(1);
    }


    private static void extracted(ABCResult r) {
        log.info("Product: {}, ABC: {}", r.getProductName(), r.getAbcClass());
    }

    @Nonnull
    private static AbcRequestDto getAbcRequestDto() {
        List<AbcItemDto> items = List.of(
                AbcItemDto.builder()
                        .product(Product.builder()
                                .name("Rose Bouquet")
                                .sku("RB001")
                                .category("Flowers")
                                .unitCost(BigDecimal.valueOf(1000.0))
                                .unitPrice(BigDecimal.valueOf(1200.0))
                                .description("Test Product A")
                                .build())
                        .demandFrequency(BigInteger.valueOf(10))
                        .salesValue(BigDecimal.valueOf(12000))
                        .build(), // A

                AbcItemDto.builder()
                        .product(Product.builder()
                                .name("Lily Bundle")
                                .sku("LB001")
                                .category("Flowers")
                                .unitCost(BigDecimal.valueOf(100.0))
                                .unitPrice(BigDecimal.valueOf(120.0))
                                .description("Test Product B")
                                .build())
                        .demandFrequency(BigInteger.valueOf(7))
                        .salesValue(BigDecimal.valueOf(840))
                        .build(), // B

                AbcItemDto.builder()
                        .product(Product.builder()
                                .name("Tulip Bunch")
                                .sku("TB001")
                                .category("Flowers")
                                .unitCost(BigDecimal.valueOf(80.0))
                                .unitPrice(BigDecimal.valueOf(96.0))
                                .description("Test Product B2")
                                .build())
                        .demandFrequency(BigInteger.valueOf(8))
                        .salesValue(BigDecimal.valueOf(768))
                        .build(), // B

                AbcItemDto.builder()
                        .product(Product.builder()
                                .name("Orchid Pot")
                                .sku("OP001")
                                .category("Flowers")
                                .unitCost(BigDecimal.valueOf(40.0))
                                .unitPrice(BigDecimal.valueOf(48.0))
                                .description("Test Product C")
                                .build())
                        .demandFrequency(BigInteger.valueOf(4))
                        .salesValue(BigDecimal.valueOf(192))
                        .build() // C
        );

        return new AbcRequestDto(items, "test-user", SimulationType.ABC_CLASSIC);
    }



    @Test
    void multiABC_shouldReorderComparedToClassic() {
        List<MonteCarloItemDto> mcItems = generator.generateMonteCarlo();
        List<AbcItemDto> items = MonteCarloABCMapper.toAbcItems(mcItems);

        AbcRequestDto classicRequest =
                new AbcRequestDto(items, "test-user", SimulationType.ABC_CLASSIC);

        AbcRequestDto multiRequest =
                new AbcRequestDto(items, "test-user", SimulationType.ABC_MULTI);

        List<AbcRankedItem> classicRankedItems =
                classicAnalyzer.analyze(classicRequest);
        List<AbcRankedItem> multiRankedItems =
                multiAnalyzer.analyze(multiRequest);

        List<ABCResult> classicResults =
                AbcAnalyzer.getAbcResults(classicRequest, classicRankedItems);
        List<ABCResult> multiResults =
                AbcAnalyzer.getAbcResults(multiRequest, multiRankedItems);

        // Log classic results
        log.info("Classic ABC Results:");
        classicResults.forEach(MonteCarloFloristAbcGeneratorTest::extracted);

        // Log multi results
        log.info("Multi ABC Results:");
        multiResults.forEach(MonteCarloFloristAbcGeneratorTest::extracted);

        // Assertion: ranking order must differ
        assertThat(classicResults)
                .extracting(ABCResult::getProductName)
                .isNotEqualTo(
                        multiResults.stream()
                                .map(ABCResult::getProductName)
                                .toList()
                );
    }



    @Test
    void shouldGenerateFloristInventoryWithAllCategories() {
        List<MonteCarloItemDto> items = generator.generateMonteCarlo();

        assertThat(items).isNotEmpty();

        items.forEach(item -> {
            Product p = item.getProduct();

            log.info(
                    "Florist item: {} [{}] | Category: {} | Demand: {} | Sales: {}",
                    p.getName(),
                    p.getSku(),
                    p.getCategory(),
                    item.getDemandFrequency(),
                    item.getSalesValue()
            );

            assertThat(p.getCategory()).isNotBlank();
        });
    }


    private static AbcItemDto abcItem(
            String name,
            String sku,
            BigDecimal unitCost,
            BigInteger demand
    ) {
        Product product = new Product();
        product.setName(name);
        product.setSku(sku);
        product.setCategory("Test Category");
        product.setUnitCost(unitCost);
        // Multiply by 1.2 using BigDecimal
        BigDecimal unitPrice = unitCost.multiply(BigDecimal.valueOf(1.2))
                .setScale(2, RoundingMode.HALF_UP); // optional rounding
        product.setUnitPrice(unitPrice);

        // Calculate salesValue: unitPrice * demand
        BigDecimal salesValue = unitPrice.multiply(new BigDecimal(demand));

        return AbcItemDto.builder()
                .product(product)
                .demandFrequency(demand)
                .salesValue(salesValue)
                .build();
    }

}
