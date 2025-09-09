package com.retailops.inventorysimulator.simulator.dto;


import com.retailops.inventorysimulator.util.SimulationType;

import java.time.LocalDateTime;

public record SimulationRunDTO(Long id,
                               SimulationType simulationType,
                               String productName,
                               int stockQty,
                               int demand,
                               double profit,
                               LocalDateTime runAt,
                               String username) {
}
