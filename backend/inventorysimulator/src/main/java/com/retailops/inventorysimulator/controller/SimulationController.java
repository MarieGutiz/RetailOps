package com.retailops.inventorysimulator.controller;


import com.retailops.inventorysimulator.simulator.dto.ProfitRequest;
import com.retailops.inventorysimulator.simulator.dto.ProfitResponse;
import com.retailops.inventorysimulator.simulator.service.SimulationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/simulate")
@RequiredArgsConstructor
public class SimulationController {

    private final SimulationService simulationService;

    @PostMapping("/profit")
    public ProfitResponse simulateProfit(@RequestBody ProfitRequest request) {
        return simulationService.calculateProfit(request);
    }

}
