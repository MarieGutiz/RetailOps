package com.retailops.inventorysimulator.simulator.dto;

import com.retailops.inventorysimulator.util.SimulationType;

import java.util.List;

public record AbcRequestDto(
        List<AbcItemDto> items,
        String username,
        SimulationType mode //Either classic or multi

) {
}
