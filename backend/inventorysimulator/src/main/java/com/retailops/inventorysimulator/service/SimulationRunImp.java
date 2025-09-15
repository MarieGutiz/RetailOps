package com.retailops.inventorysimulator.service;

import com.retailops.inventorysimulator.model.SimulationRun;
import com.retailops.inventorysimulator.repository.SimulationRepository;
import com.retailops.inventorysimulator.simulator.dto.SimulationRunDTO;
import com.retailops.inventorysimulator.util.SimulationType;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.function.Function;

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
    public List<SimulationRun> getHistoryByType(SimulationType type) {
        return simulationRepository.findBySimulationType(type);
    }


    @Override
    public Page<SimulationRun> findByUsername(String username, Pageable pageable) {
        return simulationRepository.findByUsername(username, pageable);
    }

    @Override
    public Page<SimulationRunDTO> getHistory(String username, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("runAt").descending());

        Page<SimulationRun> runs;
        if (username != null && !username.isBlank()) {
            runs = simulationRepository.findByUsername(username, pageable);
        } else {
            runs = simulationRepository.findAll(pageable);
        }

        return runs.map(toSimulationRunDTO());
    }

    @Override
    public Page<SimulationRunDTO> getHistoryByType(SimulationType type, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("runAt").descending());
        Page<SimulationRun> runs = simulationRepository.findBySimulationType(type, pageable);
        return runs.map(toSimulationRunDTO());
    }

    @Override
    public Page<SimulationRunDTO> getHistoryByUserAndType(String username, SimulationType type, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("runAt").descending());
        Page<SimulationRun> runs = simulationRepository.findByUsernameAndSimulationType(username, type, pageable);
        return runs.map(toSimulationRunDTO());
    }

    public Function<SimulationRun, SimulationRunDTO> toSimulationRunDTO() {
        return  run -> new SimulationRunDTO(
                run.getId(),
                run.getSimulationType(),
                run.getProductName(),
                run.getStockQty(),
                run.getDemand(),
                run.getProfit(),
                run.getRunAt(),
                run.getUsername()
        );
    }


}
