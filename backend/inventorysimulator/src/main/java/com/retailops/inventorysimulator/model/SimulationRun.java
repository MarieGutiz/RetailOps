package com.retailops.inventorysimulator.model;


import com.retailops.inventorysimulator.util.types.SimulationType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDateTime;

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
    private SimulationType simulationType; //save analogously e.g., "PROFIT", "NEWSVENDOR", "EOQ"

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

    private String username;//Later: Replace with manytoone user entity
}
