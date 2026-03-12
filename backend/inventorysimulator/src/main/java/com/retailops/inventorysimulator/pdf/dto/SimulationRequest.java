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

import com.retailops.inventorysimulator.util.types.SimulationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

/**
 * Base class for all simulation requests, containing common fields such as
 * simulation model, shop information, and creation timestamp.
 */
@SuperBuilder
@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class SimulationRequest {

    @NotNull(message = "Simulation model must be provided")
    private SimulationType model;

    @NotBlank(message = "Shop ID is required")
    private String shopId;

    @NotBlank(message = "Shop name is required")
    private String shopName;

    @NotNull(message = "Creation date is required")
    private LocalDateTime createdAt;
}
