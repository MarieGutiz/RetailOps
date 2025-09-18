package com.retailops.inventorysimulator.simulator.service;


import com.retailops.inventorysimulator.model.ABCResult;
import com.retailops.inventorysimulator.model.SimulationRun;
import com.retailops.inventorysimulator.repository.ABCResultRepository;
import com.retailops.inventorysimulator.repository.SimulationRepository;
import com.retailops.inventorysimulator.simulator.dto.AbcItemDto;
import com.retailops.inventorysimulator.util.SimulationType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

import static com.retailops.inventorysimulator.simulator.AbcAnalyzer.abcAnalyzer;

@Service
@RequiredArgsConstructor
public class AbcService {

    private final ABCResultRepository abcResultRepository;
    private final SimulationRepository simulationRepository;

    public List<ABCResult> runAbc(List<AbcItemDto> items, String username) {
        List<ABCResult> results = abcAnalyzer(items, username);

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
