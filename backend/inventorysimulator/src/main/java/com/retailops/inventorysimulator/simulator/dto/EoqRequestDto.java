package com.retailops.inventorysimulator.simulator.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.math.BigInteger;

public record EoqRequestDto(
        @NotBlank(message = "Product name is required")
        String productName,

        @NotNull(message = "Demand is required")
        @Positive(message = "Demand must be greater than zero")
        BigInteger demand,   // D

        @NotNull(message = "Setup cost is required")
        @DecimalMin(value = "0.0", inclusive = false,
                message = "Setup cost must be greater than zero")
        BigDecimal cost,     // S

        @NotNull(message = "Holding cost is required")
        @DecimalMin(value = "0.0", inclusive = false,
                message = "Holding cost must be greater than zero")
        BigDecimal holdingCost,   // H

        boolean saveToHistory,

        String username

) {
    public String usernameOrDefault() {
        return username != null && !username.isBlank()
                ? username
                : "guest";
    }
}