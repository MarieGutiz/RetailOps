package com.retailops.inventorysimulator.simulator.dto;

import lombok.*;

import java.util.List;

public record AbcResponseDto(
         List<AbcItemResultDto> items,
         AbcSummaryDto summary
) {
}
