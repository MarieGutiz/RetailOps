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

package com.retailops.inventorysimulator.pdf.service;


import com.retailops.inventorysimulator.model.Account;
import com.retailops.inventorysimulator.simulator.autogenshop.abc.analyzer.AbcRankedItem;
import com.retailops.inventorysimulator.simulator.dto.*;
import com.retailops.inventorysimulator.simulator.segmentation.AbcAnalyzerClassic;
import com.retailops.inventorysimulator.simulator.segmentation.AbcAnalyzerMulti;
import com.retailops.inventorysimulator.simulator.segmentation.AbcAnalyzerStrategy;
import com.retailops.inventorysimulator.simulator.segmentation.AbcSummaryBuilder;
import com.retailops.inventorysimulator.util.types.SimulationType;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service for performing ABC analysis using either classic or multi-category
 * strategies, producing a detailed response including ranked items and summary metrics.
 */
@Service
@AllArgsConstructor
public class AbcAnalysisService {

    private final AbcAnalyzerClassic classicAnalyzer;
    private final AbcAnalyzerMulti multiAnalyzer;

    /**
     * Produces AbcResponseDto using the proper ABC analyzer strategy.
     */
    public AbcResponseDto analyze(List<AbcItemDto> items, SimulationType mode) {
        if (items == null || items.isEmpty()) {
            return new AbcResponseDto(List.of(), AbcSummaryBuilder.build(List.of()));
        }
        Account placeholder= Account.builder()
                .username("abc-exportPdf-guess")
                .name("Abc-exportPdf-guess")
                .email("abc@guess.local")
                .build();
        AbcAnalyzerStrategy analyzer = selectAnalyzer(mode);
        List<AbcRankedItem> rankedItems = analyzer.analyze(
                new AbcRequestDto(
                        items,
                         placeholder,
                        mode,
                        false));

        // Map AbcRankedItem -> AbcItemResultDto
        List<AbcItemResultDto> results = rankedItems.stream().map(r -> {
            AbcItemResultDto dto = new AbcItemResultDto();
            dto.setProduct(r.item().getProduct());
            dto.setSalesValue(r.item().getSalesValue());
            dto.setDemandFrequency(r.item().getDemandFrequency());
            dto.setRank(r.rank());
            dto.setCumulativePct(r.cumulativePct());
            dto.setAbcCategoryType(r.abcCategoryType());
            return dto;
        }).toList();

        // Build summary using AbcSummaryBuilder
        AbcSummaryDto summary = AbcSummaryBuilder.build(results);

        return new AbcResponseDto(results, summary);
    }

    private AbcAnalyzerStrategy selectAnalyzer(SimulationType mode) {
        return switch (mode) {
            case ABC_CLASSIC -> classicAnalyzer;
            case ABC_MULTI -> multiAnalyzer;
            default -> classicAnalyzer;
        };
    }
}
