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
import com.retailops.inventorysimulator.simulator.autogenshop.abc.analyzer.AbcAnalyzer;
import com.retailops.inventorysimulator.simulator.autogenshop.abc.analyzer.AbcRankedItem;
import com.retailops.inventorysimulator.simulator.generator.mapper.AbcResultMapper;
import com.retailops.inventorysimulator.simulator.segmentation.AbcAnalyzerStrategy;
import com.retailops.inventorysimulator.simulator.segmentation.AbcSummaryBuilder;
import com.retailops.inventorysimulator.util.types.SimulationType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
/**
 * Service class for performing ABC Inventory Classification.
 * <p>
 * ABC analysis segments inventory items based on their relative
 * contribution to total value (typically annual consumption value).
 * <p>
 * Economic Principle:
 *
 *  A-items → High value, low quantity (~70–80% of value, ~10–20% of items)
 *  B-items → Moderate importance (~15–25% of value)
 *  C-items → Low value, high quantity (~5% of value)
 * <p>
 * Items are:
 *  1. Ranked by descending value contribution
 *  2. Cumulative percentage calculated
 *  3. Categorized into A / B / C based on threshold rules
 * <p>
 * This service:
 *  - Selects appropriate segmentation strategy (classic or multi-criteria)
 *  - Performs ranking and categorization
 *  - Builds summary metrics
 *  - Optionally persists results for analytics and reporting
 * <p>
 * Unlike EOQ (optimization) and Newsvendor (probabilistic),
 * ABC is a prioritization model for managerial focus.
 */


@Service
@RequiredArgsConstructor
@Slf4j
public class AbcService {

    private final ABCResultRepository abcResultRepository;
    private final SimulationRepository simulationRepository;
    private final List<AbcAnalyzerStrategy> analyzers;
    private final ObjectMapper objectMapper;


    /**
     * Executes ABC analysis and returns ranked items and summary data.
     *
     * @param requestDto input data containing items and analysis mode
     * @param simId simulation identifier
     * @return AbcResponseDto containing categorized items and summary
     */

    public AbcResponseDto runAbc(AbcRequestDto requestDto, String simId, String shopName) {
        log.info("[ABC] saveToHistory={}", requestDto.saveToHistory());

        log.info("[ABC] simId={}, shopName={}", simId, shopName);

        if (simId == null && shopName == null) {
            log.warn("[ABC] Simulation skipped because simId and shopName are null");
            return null;
        }

        log.info(
                "[ABC] Persisting simulation | mode={} | accountId={} | items={}",
                requestDto.mode(),
                requestDto.account() != null ? requestDto.account().getId() : "guest",
                requestDto.items().size()
        );

        AbcAnalyzerStrategy analyzer = resolveAnalyzer(requestDto.mode());

        // 1. Analyze,perform value-based ranking and segmentation
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
     * Selects the appropriate ABC analysis strategy.
     *
     * @param type simulation type
     * @return matching AbcAnalyzerStrategy
     */
    private AbcAnalyzerStrategy resolveAnalyzer(SimulationType type) {
        return analyzers.stream()
                .filter(a -> a.getType() == type)
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Invalid mode: " + type));
    }

    /**
     * Persists simulation run and corresponding ABC results
     * for registered users.
     *
     * @param requestDto input request
     * @param rankedItems ranked analysis results
     * @param results mapped persistence entities
     */
    private void persistRun(
            AbcRequestDto requestDto,
            List<AbcRankedItem> rankedItems,
            List<ABCResult> results
    ) {
        // Skip if the user did not request history saving
        if (!requestDto.saveToHistory()) return;

        // 1. Create and persist SimulationRun
        SimulationRun run = new SimulationRun();
        run.setSimulationType(requestDto.mode());
        run.setAccount(requestDto.account()); // optional, null for guest
        run.setRunAt(LocalDateTime.now());

        try {
            // Serialize input and output JSON for reference
            run.setAbcInputJson(objectMapper.writeValueAsString(requestDto.items()));
            run.setAbcResultJson(objectMapper.writeValueAsString(results));
        } catch (Exception e) {
            throw new RuntimeException("Failed to serialize ABC simulation JSON", e);
        }

        simulationRepository.save(run);

        // 2. Link ABCResult entities to the run and user
        results.forEach(r -> {
            r.setSimulationRun(run);          // link to parent run
            r.setAccount(requestDto.account()); // optional, null for guest
            r.setAnalyzedAt(run.getRunAt());  // timestamp
        });

        // 3. Persist ABCResult entities
        abcResultRepository.saveAll(results);

        log.info("[ABC] Persisted {} ABC result rows", results.size());
    }

    /**
     * Executes ABC analysis without persisting results.
     *
     * @param requestDto input data
     * @return AbcResponseDto containing categorized items and summary
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
        return new AbcResponseDto(items, summary);
    }

    }

