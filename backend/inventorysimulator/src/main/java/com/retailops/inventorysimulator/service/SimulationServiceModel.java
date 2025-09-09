package com.retailops.inventorysimulator.service;

import com.retailops.inventorysimulator.model.SimulationRun;
import com.retailops.inventorysimulator.simulator.dto.SimulationRunDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;


public interface SimulationServiceModel extends BaseService<SimulationRun, Long> {
    SimulationRun findSimulationRunById(long id);

    void save(SimulationRun sim);
    List<SimulationRun> getHistory(String username);

    //Create pagination
    Page<SimulationRun> findByUsername(String username, Pageable pageable);
    public Page<SimulationRunDTO> getHistory(String username, int page, int size);
//    List<SimulationRun> findByUsername(String username);
}
