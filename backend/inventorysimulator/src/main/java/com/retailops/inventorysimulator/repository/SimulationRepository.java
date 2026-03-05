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

     // By Account username
     List<SimulationRun> findByAccountUsername(String username);
     Page<SimulationRun> findByAccountUsername(String username, Pageable pageable);

     // By simulation type
     List<SimulationRun> findBySimulationType(SimulationType type);
     Page<SimulationRun> findBySimulationType(SimulationType type, Pageable pageable);

     // By account + type
     Page<SimulationRun> findByAccountUsernameAndSimulationType(
             String username,
             SimulationType type,
             Pageable pageable);

     // Order by run time
     List<SimulationRun> findBySimulationTypeOrderByRunAtDesc(SimulationType type);
     List<SimulationRun> findByAccountUsernameOrderByRunAtDesc(String username);


}
