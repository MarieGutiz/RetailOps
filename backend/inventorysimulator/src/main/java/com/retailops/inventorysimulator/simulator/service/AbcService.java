package com.retailops.inventorysimulator.simulator.service;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.retailops.inventorysimulator.model.ABCResult;
import com.retailops.inventorysimulator.model.SimulationRun;
import com.retailops.inventorysimulator.repository.ABCResultRepository;
import com.retailops.inventorysimulator.repository.SimulationRepository;
import com.retailops.inventorysimulator.simulator.dto.AbcItemResultDto;
import com.retailops.inventorysimulator.simulator.dto.AbcRequestDto;
import com.retailops.inventorysimulator.simulator.dto.AbcResponseDto;
import com.retailops.inventorysimulator.simulator.dto.AbcSummaryDto;
import com.retailops.inventorysimulator.simulator.floristshop.abc.analyzer.AbcAnalyzer;
import com.retailops.inventorysimulator.simulator.floristshop.abc.analyzer.AbcRankedItem;
import com.retailops.inventorysimulator.simulator.generator.mapper.AbcResultMapper;
import com.retailops.inventorysimulator.simulator.segmentation.AbcAnalyzerStrategy;
import com.retailops.inventorysimulator.simulator.segmentation.AbcSummaryBuilder;
import com.retailops.inventorysimulator.util.SimulationType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;


@Service
@RequiredArgsConstructor
public class AbcService {

    private final ABCResultRepository abcResultRepository;
    private final SimulationRepository simulationRepository;
    private final List<AbcAnalyzerStrategy> analyzers;
    private final ObjectMapper objectMapper;

    /**
     * Run ABC analysis (backend) and return frontend-ready DTO.
     * Persistence happens internally for registered users.
     */
    public AbcResponseDto runAbc(AbcRequestDto requestDto) {

        AbcAnalyzerStrategy analyzer = resolveAnalyzer(requestDto.mode());

        // 1. Analyze
        List<AbcRankedItem> ranked = analyzer.analyze(requestDto);

        // 2. Map to persistence entities
        List<ABCResult> persistedResults =
                AbcAnalyzer.getAbcResults(requestDto, ranked);

        // 3. Persist simulation run + results (registered users only)
        persistRun(requestDto, ranked, persistedResults);

        // 4. Map to frontend DTOs using EXISTING mapper
        List<AbcItemResultDto> items = ranked.stream()
                .map(r -> AbcResultMapper.toItemResult(
                        r.item(),
                        r.rank(),
                        r.cumulativePct(),
                        r.abcCategoryType()
                ))
                .toList();

        AbcSummaryDto summary = AbcSummaryBuilder.build(items);

        return new AbcResponseDto(items, summary);
    }

    /**
     * Resolve analyzer by type (classic / multi)
     */
    private AbcAnalyzerStrategy resolveAnalyzer(SimulationType type) {
        return analyzers.stream()
                .filter(a -> a.getType() == type)
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Invalid mode: " + type));
    }

    /**
     * Persist simulation run + ABCResult entities
     */
    private void persistRun(
            AbcRequestDto requestDto,
            List<AbcRankedItem> rankedItems,
            List<ABCResult> results
    ) {
        //Do not persist guests
        if (requestDto.username() == null ||
                requestDto.username().isBlank() ||
                requestDto.username().equalsIgnoreCase("guest")) {
            return;
        }

        SimulationRun run = new SimulationRun();
        run.setSimulationType(requestDto.mode());
        run.setUsername(requestDto.username());
        run.setRunAt(LocalDateTime.now());

        try {
            run.setAbcInputJson(objectMapper.writeValueAsString(requestDto.items()));
            run.setAbcResultJson(objectMapper.writeValueAsString(results));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize ABC simulation JSON", e);
        }

        simulationRepository.save(run);

        // Link and persist ABCResult entities
        results.forEach(r -> {
            r.setSimulationRun(run);
            r.setUsername(requestDto.username());
            r.setAnalyzedAt(run.getRunAt());
        });

        abcResultRepository.saveAll(results);
    }


    /**
     * Run ABC analysis for frontend simulation: returns mapped DTOs + summary.
     */
    public AbcResponseDto runAbcsim(AbcRequestDto requestDto) {

        AbcAnalyzerStrategy analyzer = resolveAnalyzer(requestDto.mode());

        // Ranked items
        List<AbcRankedItem> ranked = analyzer.analyze(requestDto);

        // Map ranked items to frontend DTOs
        List<AbcItemResultDto> items = ranked.stream()
                .map(r -> AbcResultMapper.toItemResult(
                        r.item(),
                        r.rank(),
                        r.cumulativePct(),
                        r.abcCategoryType()
                ))
                .toList();

        // Build summary
        AbcSummaryDto summary = AbcSummaryBuilder.build(items);

        // Persist simulation metadata only (registered users)
//        persistRun(requestDto, ranked, null); // null because front-end simulation may not need persistence of ABCResult entities

        return new AbcResponseDto(items, summary);
    }

    }

