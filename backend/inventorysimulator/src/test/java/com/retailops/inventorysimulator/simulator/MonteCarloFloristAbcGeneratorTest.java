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
import com.retailops.inventorysimulator.simulator.generator.MonteCarloFloristGenerator;
import com.retailops.inventorysimulator.simulator.segmentation.AbcAnalyzerClassic;
import com.retailops.inventorysimulator.simulator.segmentation.AbcAnalyzerMulti;
import com.retailops.inventorysimulator.util.SimulationType;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

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
        List<AbcItemDto> items = generator.generateMonteCarlo();

        assertThat(items).hasSize(9);

        assertThat(items)
                .allMatch(i -> i.getSalesValue().doubleValue() > 0)
                .allMatch(i -> i.getDemandFrequency().intValue() > 0)
                .allMatch(i -> i.getProductName() != null);
    }

    @Test
    void classicABC_shouldProduceABCDistribution() {
        List<AbcItemDto> items = generator.generateMonteCarlo();

        AbcRequestDto request = new AbcRequestDto(
                items,
                "test-user",
                SimulationType.ABC_CLASSIC
        );

        List<ABCResult> results = classicAnalyzer.analyze(request);

        Map<String, Long> categoryCount =
                results.stream()
                        .collect(Collectors.groupingBy(
                                r -> r.getAbcClass().name(),
                                Collectors.counting()
                        ));

        assertThat(categoryCount.get("A")).isNotZero();
        assertThat(categoryCount.get("B")).isNotZero();
        assertThat(categoryCount.get("C")).isNotZero();
    }

    @Test
    void multiABC_shouldReorderComparedToClassic() {
        List<AbcItemDto> items = generator.generateMonteCarlo();

        AbcRequestDto classicRequest =
                new AbcRequestDto(items, "test-user", SimulationType.ABC_CLASSIC);

        AbcRequestDto multiRequest =
                new AbcRequestDto(items, "test-user", SimulationType.ABC_MULTI);

        List<ABCResult> classicResults =
                classicAnalyzer.analyze(classicRequest);

        List<ABCResult> multiResults =
                multiAnalyzer.analyze(multiRequest);

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
        List<AbcItemDto> items = generator.generateMonteCarlo();

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
