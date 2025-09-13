package com.retailops.inventorysimulator.model;


import com.retailops.inventorysimulator.util.SimulationType;
import jakarta.persistence.*;
import lombok.*;

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
    private Integer stockQty;
    private Integer demand;
    private Double profit;

    // EOQ
    private Double setupCost;
    private Double holdingCost;
    private Double eoq;

    // ABC
    @Column(columnDefinition = "TEXT")
    private String abcInputJson;   // store list of items
    @Column(columnDefinition = "TEXT")
    private String abcResultJson;  // store results (category assignments)

    private LocalDateTime runAt;

    private String username;//Later: Replace with manytoone user entity
}
