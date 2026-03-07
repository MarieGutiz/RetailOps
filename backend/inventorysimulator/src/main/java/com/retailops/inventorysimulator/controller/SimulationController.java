package com.retailops.inventorysimulator.controller;


import com.retailops.inventorysimulator.simulator.service.ProfitService;
import com.retailops.inventorysimulator.simulator.dto.*;
import com.retailops.inventorysimulator.simulator.service.SimulationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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

    // History requires authentication
    @GetMapping("/history")
    public Page<SimulationRunDTO> getHistory(
            @RequestParam(required = false) String user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal(expression = "username") String authenticatedUsername
    ) {
        // Optionally override user param with authenticated username
        String queryUsername = (user != null && !user.isBlank()) ? user : authenticatedUsername;
        return simulationService.getHistory(queryUsername, page, size);
    }

}
