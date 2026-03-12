package com.retailops.inventorysimulator.simulator.dto;

import com.retailops.inventorysimulator.model.Account;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.math.BigInteger;

/**
 * Request object for running an EOQ (Economic Order Quantity) simulation.
 *
 * <p>Includes product name, demand (D), setup cost (S), holding cost (H),
 * a flag to save results to history, and an optional account for the user.</p>
 */
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

        Account account // optional, null for guest
) {
    public String usernameOrDefault() {
        return account != null && account.getUsername() != null && !account.getUsername().isBlank()
                ? account.getUsername()
                : "guest";
    }

}