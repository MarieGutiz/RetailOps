package com.retailops.inventorysimulator.simulator.dto;

import jakarta.validation.constraints.NotNull;

public record EoqRequestDto(

                Double demand,// d
                Double cost, //c
                Double holdingCost, //h

                boolean saveToHistory,
                String username
) {
}
