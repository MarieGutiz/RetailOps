package com.retailops.inventorysimulator.controller;


import com.retailops.inventorysimulator.model.SimulationRun;
import com.retailops.inventorysimulator.simulator.dto.ProfitRequest;
import com.retailops.inventorysimulator.simulator.dto.ProfitResponse;
import com.retailops.inventorysimulator.simulator.dto.SimulationRunDTO;
import com.retailops.inventorysimulator.simulator.service.SimulationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/simulate")
@RequiredArgsConstructor
public class SimulationController {

    private final SimulationService simulationService;

    @PostMapping("/profit")
    public ProfitResponse simulateProfit(@RequestBody ProfitRequest request) {
        return simulationService.calculateProfit(request);
    }

    @GetMapping("/history")
    public Page<SimulationRunDTO> getHistory(@RequestParam(required = false) String user,
                                             @RequestParam(defaultValue = "0") int page,
                                             @RequestParam(defaultValue = "10") int size){
        return  simulationService.getHistory(user, page, size);
    }
}
