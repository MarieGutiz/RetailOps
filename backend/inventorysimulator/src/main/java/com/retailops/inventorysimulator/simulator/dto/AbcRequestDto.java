package com.retailops.inventorysimulator.simulator.dto;

import com.retailops.inventorysimulator.util.types.SimulationType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record AbcRequestDto(
        @NotEmpty(message = "At least one product is required")
        @Valid
        List<AbcItemDto> items,

        String username,

        @NotNull(message = "Simulation mode is required")
        SimulationType mode,

        boolean saveToHistory

) {

    public String usernameOrDefault() {
        return username != null && !username.isBlank()
                ? username
                : "guest";
    }
}
