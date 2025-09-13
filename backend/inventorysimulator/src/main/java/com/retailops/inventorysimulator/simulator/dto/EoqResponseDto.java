package com.retailops.inventorysimulator.simulator.dto;

public record EoqResponseDto(
        double demand,
        double setupCost,
        double holdingCost,
        double eoq)
{
}
