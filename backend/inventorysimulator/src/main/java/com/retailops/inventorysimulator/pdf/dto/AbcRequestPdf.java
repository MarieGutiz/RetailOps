/*
 *
 *  * Copyright (c) 2026
 *  * Author: Mariela Paola Gutierrez
 *  * Repository: https://github.com/mariegutiz
 *  *
 *  * Licensed under the MIT License. You may obtain a copy of the License at:
 *  *     https://opensource.org/licenses/MIT
 *  *
 *  *
 *  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 *
 *
 */

package com.retailops.inventorysimulator.pdf.dto;

import com.retailops.inventorysimulator.simulator.dto.AbcItemDto;
import com.retailops.inventorysimulator.simulator.dto.AbcItemResultDto;
import com.retailops.inventorysimulator.simulator.dto.AbcResponseDto;
import com.retailops.inventorysimulator.util.types.SimulationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;
import lombok.extern.jackson.Jacksonized;

import java.util.List;

/**
 * DTO for generating an ABC PDF report, containing the simulation mode
 * and a list of items to include in the report.
 */
@SuperBuilder
@Jacksonized
@Getter
@Setter
@ToString(callSuper = true)
public class AbcRequestPdf extends SimulationRequest {

    @NotBlank(message = "ABC mode is required")
    private SimulationType mode;

    @NotNull(message = "Items list cannot be null")
    private List<AbcItemDto> items;


}
