package com.retailops.inventorysimulator.simulator.dto;

import com.retailops.inventorysimulator.model.Account;
import com.retailops.inventorysimulator.util.types.NewsvendorMode;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record NewsvendorRequest(

        @NotNull
        String productName,

        @NotNull
        @DecimalMin(value = "0.0", inclusive = false)
        BigDecimal meanDemand,

        @NotNull
        @DecimalMin(value = "0.0", inclusive = false)
        BigDecimal stdDeviation,

        @NotNull
        @DecimalMin(value = "0.0", inclusive = false)
        BigDecimal price,

        @NotNull
        @DecimalMin(value = "0.0", inclusive = false)
        BigDecimal cost,

        @NotNull
        @DecimalMin(value = "0.0")
        BigDecimal salvageValue,

        @NotNull
        @DecimalMin(value = "0.0")
        BigDecimal penalty,

        @NotNull
        NewsvendorMode mode,

        int simulationRuns,

        boolean saveToHistory,
        Account account // optional, null if guest
) {
        /**
         * Helper to get a username for display
         */
        public String usernameOrDefault() {
                return account != null && account.getUsername() != null && !account.getUsername().isBlank()
                        ? account.getUsername()
                        : "guest";
        }

}

