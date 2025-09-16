package com.retailops.inventorysimulator.controller;


import com.retailops.inventorysimulator.simulator.dto.*;
import com.retailops.inventorysimulator.simulator.service.EoqService;
import com.retailops.inventorysimulator.simulator.service.NewsVendorSimulatorService;
import com.retailops.inventorysimulator.simulator.service.SimulationProfitService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/simulate")
@RequiredArgsConstructor
public class SimulationController {

    private final SimulationProfitService simulationService;
    private final NewsVendorSimulatorService newsVendorSimulatorService;
    private final EoqService eoqService;

    @PostMapping("/profit")
    public ProfitResponse simulateProfit(@Valid  @RequestBody ProfitRequest request) {
        return simulationService.calculateProfit(request);
    }

    @GetMapping("/history")
    public Page<SimulationRunDTO> getHistory(@RequestParam(required = false) String user,
                                             @RequestParam(defaultValue = "0") int page,
                                             @RequestParam(defaultValue = "10") int size){
        return  simulationService.getHistory(user, page, size);
    }

    @PostMapping("/newsvendor")
    public NewsVendorResponse simulateNewsvendor(@Valid @RequestBody NewsVendorRequest request) {
        return newsVendorSimulatorService.simulate(request);
    }

    @PostMapping("/eoq")
    public EoqResponseDto simulateEOQ(@Valid @RequestBody EoqRequestDto requestDto) {
        return eoqService.runEoq(requestDto);
    }

}
