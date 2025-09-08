package com.retailops.inventorysimulator.repository;

import com.retailops.inventorysimulator.model.SimulationRun;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SimulationRepository extends JpaRepository<SimulationRun, Long> {
     SimulationRun findSimulationRunById(long id);
     List<SimulationRun> findByUsername(String username);
     Page<SimulationRun> findByUsername(String username, Pageable pageable);

}
