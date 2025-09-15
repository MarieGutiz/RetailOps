package com.retailops.inventorysimulator.simulator.dto;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.math.BigInteger;


public record ProfitRequest(@NotNull
                            Long productId,

                            @Min(value = 0, message = "Stock quantity must be >= 0")
                            @Digits(integer = 10, fraction = 0, message = "SKU product quantity must be an integer value")
                            BigInteger stockQty,

                            @Digits(integer = 10, fraction = 0, message = "Demand must be an integer value")
                            @Min(value = 0, message = "Demand must be >= 0")
                            BigInteger demand,

                            boolean saveToHistory,
                            String username) {
                        // Default values if null
                        public BigInteger stockQtyOrDefault() {
                            return stockQty != null ? stockQty : BigInteger.ZERO;
                        }

                        public BigInteger demandOrDefault() {
                            return demand != null ? demand : BigInteger.ZERO;
                        }

                        public String usernameOrDefault() {
                            return username != null && !username.isBlank() ? username : "guest";
                        }


}
