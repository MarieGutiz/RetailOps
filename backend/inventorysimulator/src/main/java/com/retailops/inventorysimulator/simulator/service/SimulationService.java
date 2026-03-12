package com.retailops.inventorysimulator.simulator.service;

import com.retailops.inventorysimulator.service.SimulationServiceModel;
import com.retailops.inventorysimulator.simulator.dto.ProfitRequest;
import com.retailops.inventorysimulator.simulator.dto.ProfitResponse;
import com.retailops.inventorysimulator.simulator.dto.SimulationRunDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.math.RoundingMode;

/**
 * Service for managing and retrieving simulation runs.
 *
 * <p>Provides methods to access historical simulation data for a given user,
 * delegating persistence operations to {@link SimulationServiceModel}.</p>
 */
@Service
@RequiredArgsConstructor
public class SimulationService {
    private final SimulationServiceModel simulationServiceModel;

    public Page<SimulationRunDTO> getHistory(String username, int page, int size) {
        return simulationServiceModel.getHistoryByUsername(username, page, size);
    }
}
