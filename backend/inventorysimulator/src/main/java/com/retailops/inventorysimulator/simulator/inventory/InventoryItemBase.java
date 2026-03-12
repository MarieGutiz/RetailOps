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

package com.retailops.inventorysimulator.simulator.inventory;

import com.retailops.inventorysimulator.model.Product;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.math.BigInteger;

/**
 * Base class representing an inventory item with core attributes.
 *
 * <p>Includes product details, demand frequency, and sales value, with
 * validation constraints to ensure required fields and valid numeric values.</p>
 */

@SuperBuilder
@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class InventoryItemBase {

    @NotNull(message = "Product is required")
    private Product product;

    @NotNull(message = "Demand frequency is required")
    @PositiveOrZero(message = "Demand frequency must be zero or greater")
    private BigInteger demandFrequency;

    @NotNull(message = "Sales value is required")
    @DecimalMin(value = "0.0", inclusive = false,
            message = "Sales value must be greater than zero")
    private BigDecimal salesValue;
}
