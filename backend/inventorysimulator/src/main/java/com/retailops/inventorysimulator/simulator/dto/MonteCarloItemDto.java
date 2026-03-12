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

package com.retailops.inventorysimulator.simulator.dto;

import com.retailops.inventorysimulator.simulator.inventory.InventoryItemBase;
import lombok.*;

/**
 * Data transfer object for ABC analysis, extending {@link InventoryItemBase}.
 *
 * <p>Represents an inventory item prepared for ABC ranking and simulation,
 * including all product, demand, and sales value information.</p>
 */
@Getter
@Setter
@RequiredArgsConstructor
@ToString(callSuper = true)
public class MonteCarloItemDto extends InventoryItemBase {
    // Monte Carlo specific behavior later:
    // - distribution metadata
    // - seed reference
}
