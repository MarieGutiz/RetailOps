package com.retailops.inventorysimulator.simulator.dto;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.math.BigInteger;

public record EoqRequestDto(
        @NotNull Long productId,
        BigInteger demand,// d
        BigDecimal cost, //c
        BigDecimal holdingCost, //h

        boolean saveToHistory,
        String username
) {
}
