package com.retailops.inventorysimulator.simulator.service;

import com.retailops.inventorysimulator.model.SimulationRun;
import com.retailops.inventorysimulator.service.SimulationServiceModel;
import com.retailops.inventorysimulator.util.SimulationType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class EoqService {
    final SimulationServiceModel simulationServiceModel;

    public void runEoq(String productName, double demand, double setupCost, double holdingCost, String username) {
        double eoq = Math.sqrt((2 * demand * setupCost) / holdingCost);

        SimulationRun run = new SimulationRun();
        run.setSimulationType(SimulationType.EOQ);
        run.setProductName(productName);
        run.setDemand((int) demand);
        run.setSetupCost(setupCost);
        run.setHoldingCost(holdingCost);
        run.setEoq(eoq);
        run.setUsername(username);
        run.setRunAt(LocalDateTime.now());

        simulationServiceModel.save(run);
    }
}
