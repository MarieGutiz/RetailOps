package com.retailops.inventorysimulator.simulator.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record NewsVendorRequest(
                @NotNull Long productId,

                @NotNull @DecimalMin(value = "0.0", inclusive = false, message = "Mean demand must be > 0")
                BigDecimal meanDemand,

                @NotNull @DecimalMin(value = "0.0", message = "Variance must be >= 0")
                BigDecimal variance,

                boolean saveToHistory,
                String username
) {
    public String usernameOrDefault() {
        return username != null && !username.isBlank() ? username : "guest";
    }

}
