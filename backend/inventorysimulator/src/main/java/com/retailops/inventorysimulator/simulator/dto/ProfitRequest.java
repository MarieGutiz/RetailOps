package com.retailops.inventorysimulator.simulator.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.math.BigInteger;


public record ProfitRequest(
                            @NotNull
                            @NotBlank(message = "Product name is required")
                                     String productName,
                            @NotNull
                            @DecimalMin(value = "0.0", inclusive = false)
                            BigDecimal price,

                            @NotNull
                            @DecimalMin(value = "0.0", inclusive = false)
                            BigDecimal cost,

                            @Min(value = 0, message = "Stock quantity must be >= 0")
                            @Digits(integer = 10, fraction = 0, message = "SKU product quantity must be an integer value")
                            BigInteger stockQty,

                            @Digits(integer = 10, fraction = 0, message = "Demand must be an integer value")
                            @Min(value = 0, message = "Demand must be >= 0")
                            BigInteger demand,

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
