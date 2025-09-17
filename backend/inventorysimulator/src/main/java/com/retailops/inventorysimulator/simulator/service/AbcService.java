package com.retailops.inventorysimulator.simulator.service;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.retailops.inventorysimulator.model.ABCResult;
import com.retailops.inventorysimulator.model.SimulationRun;
import com.retailops.inventorysimulator.repository.ABCResultRepository;
import com.retailops.inventorysimulator.repository.SimulationRepository;
import com.retailops.inventorysimulator.service.SimulationServiceModel;
import com.retailops.inventorysimulator.simulator.dto.AbcItemDto;
import com.retailops.inventorysimulator.simulator.dto.AbcResultDto;
import com.retailops.inventorysimulator.util.ABCCategoryType;
import com.retailops.inventorysimulator.util.SimulationType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AbcService {

    private final ABCResultRepository abcResultRepository;
    private final SimulationRepository simulationRepository;

    public List<ABCResult> runAbc(List<AbcItemDto> items, String username) {
        // Sort by sales value descending
        items.sort(Comparator.comparing(AbcItemDto::getSalesValue).reversed());

        BigDecimal totalSales = items.stream()
                .map(AbcItemDto::getSalesValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal cumulative = BigDecimal.ZERO;
        List<ABCResult> results = new ArrayList<>();

        int rank = 1;
        for (AbcItemDto item : items) {
            cumulative = cumulative.add(item.getSalesValue());
            BigDecimal contribution = cumulative
                    .divide(totalSales, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100)); // %

            ABCCategoryType category;
            if (contribution.compareTo(BigDecimal.valueOf(80)) <= 0) {
                category = ABCCategoryType.A;
            } else if (contribution.compareTo(BigDecimal.valueOf(95)) <= 0) {
                category = ABCCategoryType.B;
            } else {
                category = ABCCategoryType.C;
            }

            ABCResult result = new ABCResult();
            result.setProductName(item.getProductName());
            result.setAbcClass(category);
            result.setContributionPercentage(contribution);
            result.setRank(rank++);
            result.setUsername(username);
            result.setAnalyzedAt(LocalDateTime.now());

            results.add(result);
        }

        // Persist SimulationRun
        SimulationRun run = new SimulationRun();
        run.setSimulationType(SimulationType.ABC);
        run.setUsername(username);
        run.setRunAt(LocalDateTime.now());
        simulationRepository.save(run);

        // Link results to run
        for (ABCResult result : results) {
            result.setSimulationRun(run);
        }
        abcResultRepository.saveAll(results);

        return results;
    }
}
