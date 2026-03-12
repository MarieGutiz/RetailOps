package com.retailops.inventorysimulator.simulator.dto;


import java.util.List;

/**
 * Response object for an ABC simulation.
 *
 * <p>Contains the list of analyzed items as {@link AbcItemResultDto} and a
 * summary of the simulation in {@link AbcSummaryDto}.</p>
 */
public record AbcResponseDto(
         List<AbcItemResultDto> items,
         AbcSummaryDto summary
) {
}
