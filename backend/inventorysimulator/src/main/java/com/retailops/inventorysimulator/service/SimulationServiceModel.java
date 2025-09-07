package com.retailops.inventorysimulator.service;

import com.retailops.inventorysimulator.model.SimulationRun;

import java.util.List;


public interface SimulationServiceModel extends BaseService<SimulationRun, Long> {
    SimulationRun findSimulationRunById(long id);

    void save(SimulationRun sim);
    List<SimulationRun> getHistory();
}
