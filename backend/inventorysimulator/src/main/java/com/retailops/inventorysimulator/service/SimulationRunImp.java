package com.retailops.inventorysimulator.service;

import com.retailops.inventorysimulator.model.SimulationRun;
import com.retailops.inventorysimulator.repository.SimulationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SimulationRunImp extends BaseServiceImpl<SimulationRun> implements SimulationServiceModel {
    private final SimulationRepository simulationRepository;


    @Override
    protected JpaRepository<SimulationRun, Long> getRepository() {
        return simulationRepository;
    }


    @Override
    public SimulationRun findSimulationRunById(long id) {
        return simulationRepository.getReferenceById(id);
    }

    @Override
    public void save(SimulationRun sim) {
        simulationRepository.save(sim);
    }

    @Override
    public List<SimulationRun> getHistory() {
        return simulationRepository.findAll();
    }
}
