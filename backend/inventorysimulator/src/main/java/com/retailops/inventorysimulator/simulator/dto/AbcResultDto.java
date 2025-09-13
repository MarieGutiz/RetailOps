package com.retailops.inventorysimulator.simulator.dto;

public record AbcResultDto(
        String productName,
        Double salesValue,
        String category // "A", "B", "C"
) {
}
