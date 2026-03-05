package com.retailops.inventorysimulator.service;

import com.retailops.inventorysimulator.model.SimulationRun;
import com.retailops.inventorysimulator.simulator.dto.SimulationRunDTO;
import com.retailops.inventorysimulator.util.types.SimulationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;


public interface SimulationServiceModel extends BaseService<SimulationRun, Long> {
    SimulationRun findSimulationRunById(long id);

    void save(SimulationRun sim);

    // ---------- BASIC HISTORY ----------

    List<SimulationRun> getHistoryByUsername(String username);

    List<SimulationRun> getHistoryByType(SimulationType type);


    // ---------- PAGINATION ----------

    Page<SimulationRun> findByAccountUsername(String username, Pageable pageable);

    Page<SimulationRunDTO> getHistoryByUsername(String username, int page, int size);


    // ---------- FILTERING ----------

    Page<SimulationRunDTO> getHistoryByType(SimulationType type, int page, int size);

    Page<SimulationRunDTO> getHistoryByUsernameAndType(
            String username,
            SimulationType type,
            int page,
            int size
    );


}
