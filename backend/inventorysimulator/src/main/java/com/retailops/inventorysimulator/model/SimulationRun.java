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

    private SimulationType simulationType; //save analogously e.g., "PROFIT", "NEWSVENDOR", "EOQ"

    private String productName;

    private Integer stockQty;
    private Integer demand;
    private Double profit;

    private LocalDateTime runAt;

    private String username;//Later: Replace with manytoone user entity
}
