package com.retailops.inventorysimulator.service;

import com.retailops.inventorysimulator.model.SimulationRun;
import com.retailops.inventorysimulator.repository.SimulationRepository;
import com.retailops.inventorysimulator.simulator.dto.SimulationRunDTO;
import com.retailops.inventorysimulator.transfer.AccountDTO;
import com.retailops.inventorysimulator.util.types.SimulationType;
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

    public Function<SimulationRun, SimulationRunDTO> toSimulationRunDTO() {
        return run -> new SimulationRunDTO(
                run.getId(),
                run.getSimulationType(),
                run.getProductName(),
                run.getStockQty(),
                run.getDemand(),
                run.getProfit(),
                run.getRunAt(),
                run.getAccount()
        );
    }

    @Override
    public SimulationRun findSimulationRunById(long id) {
        return simulationRepository.findSimulationRunById(id);
    }

    @Override
    public void save(SimulationRun sim) {
        simulationRepository.save(sim);
    }

    // ---------------- HISTORY ----------------

    @Override
    public List<SimulationRun> getHistoryByUsername(String username) {
        return simulationRepository.findByAccountUsername(username);
    }

    @Override
    public List<SimulationRun> getHistoryByType(SimulationType type) {
        return simulationRepository.findBySimulationType(type);
    }

    // ---------------- PAGINATION ----------------

    @Override
    public Page<SimulationRun> findByAccountUsername(String username, Pageable pageable) {
        return simulationRepository.findByAccountUsername(username, pageable);
    }

    @Override
    public Page<SimulationRunDTO> getHistoryByUsername(String username, int page, int size) {

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "runAt")
        );

        return simulationRepository
                .findByAccountUsername(username, pageable)
                .map(toSimulationRunDTO());
    }

    @Override
    public Page<SimulationRunDTO> getHistoryByType(SimulationType type, int page, int size) {

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "runAt")
        );

        return simulationRepository
                .findBySimulationType(type, pageable)
                .map(toSimulationRunDTO());
    }

    @Override
    public Page<SimulationRunDTO> getHistoryByUsernameAndType(String username, SimulationType type, int page, int size) {

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "runAt")
        );

        return simulationRepository
                .findByAccountUsernameAndSimulationType(username, type, pageable)
                .map(toSimulationRunDTO());
    }

}
