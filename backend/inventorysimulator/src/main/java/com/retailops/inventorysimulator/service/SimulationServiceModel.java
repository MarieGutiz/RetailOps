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
    List<SimulationRun> getHistory(String username);
    List<SimulationRun> getHistoryByType(SimulationType type);

    //Create pagination
    Page<SimulationRun> findByUsername(String username, Pageable pageable);
    public Page<SimulationRunDTO> getHistory(String username, int page, int size);

    //Add Filtering by Username + SimulationType
    Page<SimulationRunDTO> getHistoryByType(SimulationType type, int page, int size);

    Page<SimulationRunDTO> getHistoryByUserAndType(String username, SimulationType type, int page, int size);


}
