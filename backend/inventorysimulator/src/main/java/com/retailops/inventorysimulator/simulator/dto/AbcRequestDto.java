package com.retailops.inventorysimulator.simulator.dto;

import java.util.List;

public record AbcRequestDto(
        List<AbcItemDto> items,
        String username,
        String mode //Either classic or multi

) {
}
