package com.retailops.inventorysimulator.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;


@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(callSuper = true)
@Entity
public class Product extends BaseModel{
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;

    @NotBlank(message = "Product name is required")
    private String name;

    @NotBlank(message = "Category is required")
    @Column(length = 80, nullable = false)
    private String category;

    @Positive(message = "Unit cost must be greater than 0")
    private Double unitCost;

    @AssertTrue(message = "Unit price must be greater than cost")
    private boolean isPriceValid() {
        return unitPrice != null && unitCost != null && unitPrice > unitCost;
    }

    @Positive(message = "Unit price must be greater than 0")
    private Double unitPrice;
}
