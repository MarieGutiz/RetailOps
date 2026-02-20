package com.retailops.inventorysimulator.simulator.dto;


import java.util.List;

public record AbcResponseDto(
         List<AbcItemResultDto> items,
         AbcSummaryDto summary
) {
}
