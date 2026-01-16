package com.retailops.inventorysimulator.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;


@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(callSuper = true)
@Entity
public class Product extends BaseModel{

    @NotBlank(message = "Product name is required")
    private String name;

    @NotBlank
    @Size(max = 50)
    private String sku;

    @NotBlank(message = "Category is required")
    @Column(length = 80, nullable = false)
    private String category;

    @Column(length = 150, nullable = true)
    private String description;

    @Positive(message = "Unit cost must be greater than 0")
    private BigDecimal unitCost;

    @Positive(message = "Unit price must be greater than 0")
    private BigDecimal unitPrice;

    @AssertTrue(message = "Unit price must be greater than cost")
    private boolean isPriceValid() {
        return unitPrice != null && unitCost != null && unitPrice.compareTo(unitCost) > 0;
    }
}
