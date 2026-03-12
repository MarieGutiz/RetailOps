package com.retailops.inventorysimulator.model;


import com.retailops.inventorysimulator.util.types.SimulationType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDateTime;

/**
 * Entity representing a simulation run, storing input parameters, results,
 * and metadata for different simulation types (Profit, Newsvendor, EOQ, ABC),
 * with an optional link to the user account that performed the run.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(callSuper = true)
@Entity
@Table(name = "simulation_runs")
public class SimulationRun extends BaseModel{

    @Enumerated(EnumType.STRING)
    private SimulationType simulationType; // e.g., "PROFIT", "NEWSVENDOR", "EOQ"

    private String productName;

    // Profit / Newsvendor
    private BigInteger stockQty;
    private BigInteger demand;
    private BigDecimal profit;

    // EOQ
    private BigDecimal setupCost;
    private BigDecimal holdingCost;
    private BigDecimal eoq;

    // ABC
    @Column(columnDefinition = "TEXT")
    private String abcInputJson;   // store list of items
    @Column(columnDefinition = "TEXT")
    private String abcResultJson;  // store results (category assignments)

    private LocalDateTime runAt;

    // Optional link to Account (null for guest users)
    @ManyToOne(optional = true)
    @JoinColumn(name = "account_id", referencedColumnName = "id")
    private Account account;

    /**
     * Convenience getter for display purposes:
     * returns the account username if present, otherwise "guest".
     */
    public String getUsernameOrGuest() {
        return account != null && account.getUsername() != null
                ? account.getUsername()
                : "guest";
    }

}
