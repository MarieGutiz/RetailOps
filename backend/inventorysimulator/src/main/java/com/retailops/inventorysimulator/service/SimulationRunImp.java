package com.retailops.inventorysimulator.service;

import com.retailops.inventorysimulator.model.SimulationRun;
import com.retailops.inventorysimulator.repository.SimulationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
    public List<SimulationRun> getHistory(String username) {
        if (username != null && !username.isBlank()) {
            return simulationRepository.findByUsername(username);

        }

        return simulationRepository.findAll();
    }


    @Override
    public Page<SimulationRun> findByUsername(String username, Pageable pageable) {
        return simulationRepository.findByUsername(username, pageable);
    }

    @Override
    public Page<SimulationRun> getHistory(String username, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("runAt").descending());

        if (username != null && !username.isBlank()) {
            return simulationRepository.findByUsername(username, pageable);
        }
        return simulationRepository.findAll(pageable);
    }


}
