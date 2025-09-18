

package com.retailops.inventorysimulator.model;

import com.retailops.inventorysimulator.util.ABCCategoryType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(callSuper = true)
@Entity
@Table(name = "abc_results")
public class ABCResult extends BaseModel {

    @Enumerated(EnumType.STRING)
    private ABCCategoryType abcClass; // A, B, C

    private String productName;

    @Column(precision = 19, scale = 4) // BigDecimal for money percentages
    private BigDecimal contributionPercentage; // e.g., 55.3000%

    private int rank; // position in sorted list

    private String username; // optional, later link to User entity

    private LocalDateTime analyzedAt;

    // Optional link back to the run
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "simulation_run_id")
    private SimulationRun simulationRun;
}
