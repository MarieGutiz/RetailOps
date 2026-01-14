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
import com.retailops.inventorysimulator.simulator.dto.AbcItemDto;
import com.retailops.inventorysimulator.simulator.dto.AbcRequestDto;
import com.retailops.inventorysimulator.simulator.dto.MonteCarloItemDto;
import com.retailops.inventorysimulator.simulator.floristshop.abc.analyzer.AbcAnalyzer;
import com.retailops.inventorysimulator.simulator.floristshop.abc.analyzer.AbcRankedItem;
import com.retailops.inventorysimulator.simulator.generator.MonteCarloFloristGenerator;
import com.retailops.inventorysimulator.simulator.generator.mapper.MonteCarloABCMapper;
import com.retailops.inventorysimulator.simulator.segmentation.AbcAnalyzerClassic;
import com.retailops.inventorysimulator.simulator.segmentation.AbcAnalyzerMulti;
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
import java.util.Map;
import java.util.stream.Collectors;

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
                .allMatch(i -> i.getSalesValue().doubleValue() > 0)
                .allMatch(i -> i.getDemandFrequency().intValue() > 0)
                .allMatch(i -> i.getProductName() != null);
    }

    @Test
    void classicABC_shouldProduceABCDistribution() {
        //  Deterministic test data (guaranteed A/B/C)
        AbcRequestDto request = getAbcRequestDto();
//        classicAnalyzer.setThresholds(0.7, 0.2, 0.1);

        //  Run analyzer
        List<AbcRankedItem> ranked = classicAnalyzer.analyze(request);

        // Convert to results
        List<ABCResult> results = AbcAnalyzer.getAbcResults(request, ranked);

        // Optional: log results for clarity
        results.forEach(MonteCarloFloristAbcGeneratorTest::extracted
        );

        // Count categories
        Map<String, Long> categoryCount = results.stream()
                .collect(Collectors.groupingBy(
                        r -> r.getAbcClass().name(),
                        Collectors.counting()
                ));

        // Assertions
        assertThat(categoryCount.getOrDefault("A", 0L)).isNotZero();
        assertThat(categoryCount.getOrDefault("B", 0L)).isNotZero();
        assertThat(categoryCount.getOrDefault("C", 0L)).isNotZero();
    }

    private static void extracted(ABCResult r) {
        log.info("Product: {}, ABC: {}", r.getProductName(), r.getAbcClass());
    }

    @Nonnull
    private static AbcRequestDto getAbcRequestDto() {
        List<AbcItemDto> items = List.of(
                new AbcItemDto("Rose Bouquet", "RB001", BigDecimal.valueOf(1000), BigInteger.valueOf(10), null, null), // A
                new AbcItemDto("Lily Bundle", "LB001", BigDecimal.valueOf(100), BigInteger.valueOf(7), null, null),     // B
                new AbcItemDto("Tulip Bunch", "TB001", BigDecimal.valueOf(80), BigInteger.valueOf(8), null, null),      // B
                new AbcItemDto("Orchid Pot", "OP001", BigDecimal.valueOf(40), BigInteger.valueOf(4), null, null),       // C
                new AbcItemDto("Daisy Vase", "DV001", BigDecimal.valueOf(20), BigInteger.valueOf(5), null, null),       // C
                new AbcItemDto("Sunflower Stem", "SS001", BigDecimal.valueOf(10), BigInteger.valueOf(2), null, null)   // C
        );


        // Prepare request
        return new AbcRequestDto(
                items,
                "test-user",
                SimulationType.ABC_CLASSIC
        );
    }

    @Test
    void multiABC_shouldReorderComparedToClassic() {
        List<MonteCarloItemDto> mcItems = generator.generateMonteCarlo();
        List<AbcItemDto> items = MonteCarloABCMapper.toAbcItems(mcItems);

        AbcRequestDto classicRequest =
                new AbcRequestDto(items, "test-user", SimulationType.ABC_CLASSIC);

        AbcRequestDto multiRequest =
                new AbcRequestDto(items, "test-user", SimulationType.ABC_MULTI);

        List<AbcRankedItem> classicRankedItems = classicAnalyzer.analyze(classicRequest);
        List<AbcRankedItem> multiRankedItems  = multiAnalyzer.analyze(multiRequest);

        List<ABCResult> classicResults = AbcAnalyzer.getAbcResults(classicRequest, classicRankedItems);
        List<ABCResult> multiResults = AbcAnalyzer.getAbcResults(multiRequest, multiRankedItems);

        // Optional: log results for classic
        log.info("Classic Results: {}", classicResults);
        classicResults.forEach(MonteCarloFloristAbcGeneratorTest::extracted
        );

        //log result for multi
        log.info("Multi Results: {}", multiResults);
        multiResults.forEach(MonteCarloFloristAbcGeneratorTest::extracted);


        multiResults.forEach(r -> {
            // calculate weighted score for logging
            AbcItemDto item = items.stream()
                    .filter(i -> i.getProductName().equals(r.getProductName()))
                    .findFirst().orElse(null);

            if (item != null) {
                BigDecimal totalSales = items.stream()
                        .map(AbcItemDto::getSalesValue)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);
                BigInteger totalDemand = items.stream()
                        .map(AbcItemDto::getDemandFrequency)
                        .reduce(BigInteger.ZERO, BigInteger::add);
                BigDecimal weightedScore = new BigDecimal("0.7").multiply(
                                item.getSalesValue().divide(totalSales, 6, RoundingMode.HALF_UP))
                        .add(new BigDecimal("0.3").multiply(
                                new BigDecimal(item.getDemandFrequency())
                                        .divide(new BigDecimal(totalDemand), 6, RoundingMode.HALF_UP)
                        ));


            }
        });

        // Assertion: order should differ
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

        items.forEach(item ->
                log.info("Florist item: {} - Demand: {} - Sales: {}",
                        item.getProductName(),
                        item.getDemandFrequency(),
                        item.getSalesValue()
                )
        );

    }

}
