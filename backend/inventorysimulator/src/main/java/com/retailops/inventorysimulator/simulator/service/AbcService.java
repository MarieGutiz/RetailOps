package com.retailops.inventorysimulator.simulator.service;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
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
    private final ObjectMapper objectMapper;

    public List<ABCResult> runAbc(AbcRequestDto requestDto) {
        SimulationType type = requestDto.mode();
        AbcAnalyzerStrategy analyzer = analyzers.stream()
                .filter(a -> a.getType() == type)
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Invalid mode"));

        List<ABCResult> results = analyzer.analyze(requestDto);

        // persist run
        SimulationRun run = new SimulationRun();
        run.setSimulationType(analyzer.getType());
        run.setUsername(requestDto.username());
        run.setRunAt(LocalDateTime.now());

        try{
            // Persist snapshot as JSON
            run.setAbcInputJson(objectMapper.writeValueAsString(requestDto.items()));
            run.setAbcResultJson(objectMapper.writeValueAsString(results));
        }catch (JsonProcessingException e){
            throw new RuntimeException("Failed to serialized JSON at ABC Snapshot "+e);

        }

        simulationRepository.save(run);

        results.forEach(r -> r.setSimulationRun(run));
        abcResultRepository.saveAll(results);

        return results;
    }
}

