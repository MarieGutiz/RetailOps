package com.retailops.inventorysimulator.simulator.dto;


import com.retailops.inventorysimulator.model.Account;
import com.retailops.inventorysimulator.util.types.SimulationType;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDateTime;

/**
 * Data transfer object representing a single simulation run.
 *
 * <p>Includes the simulation ID, type, product details, stock and demand quantities,
 * calculated profit, timestamp of the run, and the associated account.</p>
 */
public record SimulationRunDTO(Long id,
                               SimulationType simulationType,
                               String productName,
                               BigInteger stockQty,
                               BigInteger demand,
                               BigDecimal profit,
                               LocalDateTime runAt,
                               Account account) {
}
