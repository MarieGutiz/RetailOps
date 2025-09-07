package com.retailops.inventorysimulator.repository;

import com.retailops.inventorysimulator.model.SimulationRun;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SimulationRepository extends JpaRepository<SimulationRun, Long> {
     SimulationRun findSimulationRunById(long id);

}
