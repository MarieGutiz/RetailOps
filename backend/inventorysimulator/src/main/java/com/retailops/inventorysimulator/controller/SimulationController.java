package com.retailops.inventorysimulator.controller;


import com.retailops.inventorysimulator.simulator.service.ProfitService;
import com.retailops.inventorysimulator.simulator.dto.*;
import com.retailops.inventorysimulator.simulator.service.SimulationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/simulation")
@RequiredArgsConstructor
public class SimulationController {

    private final SimulationService simulationService;
    private final ProfitService profitService;

    @PostMapping("/profit")
    public ProfitResponse simulateProfit(@Valid  @RequestBody ProfitRequest request) {
        return profitService.calculateProfit(request);
    }

    @GetMapping("/history")
    public Page<SimulationRunDTO> getHistory(@RequestParam(required = false) String user,
                                             @RequestParam(defaultValue = "0") int page,
                                             @RequestParam(defaultValue = "10") int size){
        return  simulationService.getHistory(user, page, size);
    }
}
