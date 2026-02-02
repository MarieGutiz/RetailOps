package com.retailops.inventorysimulator.repository;

import com.retailops.inventorysimulator.model.SimulationRun;
import com.retailops.inventorysimulator.util.types.SimulationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SimulationRepository extends JpaRepository<SimulationRun, Long> {

     SimulationRun findSimulationRunById(long id);

     //By User
     List<SimulationRun> findByUsername(String username);
     Page<SimulationRun> findByUsername(String username, Pageable pageable);

     // All runs of a specific type (e.g., EOQ only)
     // By simulation type
     List<SimulationRun> findBySimulationType(SimulationType type);
     Page<SimulationRun> findBySimulationType(SimulationType type, Pageable pageable);

     // By user + type
     List<SimulationRun> findByUsernameAndSimulationType(String username, SimulationType type);
     Page<SimulationRun> findByUsernameAndSimulationType(String username, SimulationType type, Pageable pageable);

     // Order by time (optional, makes frontend life easier)
     List<SimulationRun> findBySimulationTypeOrderByRunAtDesc(SimulationType type);
     List<SimulationRun> findByUsernameOrderByRunAtDesc(String username);

}
