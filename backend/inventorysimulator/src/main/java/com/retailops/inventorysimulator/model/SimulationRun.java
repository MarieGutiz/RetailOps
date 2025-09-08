package com.retailops.inventorysimulator.model;


import com.retailops.inventorysimulator.util.SimulationType;
import jakarta.persistence.Entity;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(callSuper = true)
@Entity
public class SimulationRun extends BaseModel{

    private SimulationType simulationType; // e.g., "PROFIT", "NEWSVENDOR", "EOQ"

    private String productName;

    private int stockQty;
    private int demand;
    private double profit;

    private LocalDateTime runAt;

    private String username;//Later: Replace with manytoone user entity
}
