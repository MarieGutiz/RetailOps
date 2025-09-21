package com.retailops.inventorysimulator.simulator.service;


import com.retailops.inventorysimulator.model.ABCResult;
import com.retailops.inventorysimulator.model.SimulationRun;
import com.retailops.inventorysimulator.repository.ABCResultRepository;
import com.retailops.inventorysimulator.repository.SimulationRepository;
import com.retailops.inventorysimulator.simulator.AbcAnalyzer;
import com.retailops.inventorysimulator.simulator.dto.AbcItemDto;
import com.retailops.inventorysimulator.simulator.dto.AbcRequestDto;
import com.retailops.inventorysimulator.simulator.segmentation.AbcAnalyzerStrategy;
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

    public List<ABCResult> runAbc(AbcRequestDto requestDto) {
        AbcAnalyzerStrategy analyzer = analyzers.stream()
                .filter(a -> a.getType().name().equalsIgnoreCase(requestDto.mode()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Invalid mode"));

        List<ABCResult> results = analyzer.analyze(requestDto);

        // persist run
        SimulationRun run = new SimulationRun();
        run.setSimulationType(analyzer.getType());
        run.setUsername(requestDto.username());
        run.setRunAt(LocalDateTime.now());
        simulationRepository.save(run);

        results.forEach(r -> r.setSimulationRun(run));
        abcResultRepository.saveAll(results);

        return results;
    }
}

