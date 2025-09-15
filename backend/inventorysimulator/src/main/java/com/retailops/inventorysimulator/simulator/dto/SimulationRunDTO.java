package com.retailops.inventorysimulator.simulator.dto;


import com.retailops.inventorysimulator.util.SimulationType;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDateTime;

public record SimulationRunDTO(Long id,
                               SimulationType simulationType,
                               String productName,
                               BigInteger stockQty,
                               BigInteger demand,
                               BigDecimal profit,
                               LocalDateTime runAt,
                               String username) {
}
