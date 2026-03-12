package com.retailops.inventorysimulator.controller;


import com.retailops.inventorysimulator.simulator.service.ProfitService;
import com.retailops.inventorysimulator.simulator.dto.*;
import com.retailops.inventorysimulator.simulator.service.SimulationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


/**
 * REST controller for general simulations, providing endpoints to:
 * - Calculate profit for given inputs
 * - Retrieve paginated simulation history for users
 */
@RestController
@RequestMapping("/api/simulation")
@RequiredArgsConstructor
public class SimulationController {

    private final SimulationService simulationService;
    private final ProfitService profitService;


    /**
     * Simulates the profit based on the provided input parameters.
     *
     * Accepts a ProfitRequest containing relevant inputs (e.g., sales, costs)
     * and returns a ProfitResponse with the calculated profit results.
     *
     * @param request the input data for profit simulation
     * @return ProfitResponse with the computed profit metrics
     */

    @PostMapping("/profit")
    public ProfitResponse simulateProfit(@Valid  @RequestBody ProfitRequest request) {
        return profitService.calculateProfit(request);
    }

    /**
     * Retrieves the simulation history for a specific user.
     *
     * Supports optional filtering by username. If no username is provided,
     * the authenticated user's history is returned. Results are paginated.
     *
     * Requires authentication.
     *
     * @param user optional username to filter the history
     * @param page page number for pagination (default: 0)
     * @param size page size for pagination (default: 10)
     * @param authenticatedUsername username of the currently authenticated user
     * @return a paginated list of SimulationRunDTO representing past simulation runs
     */

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
