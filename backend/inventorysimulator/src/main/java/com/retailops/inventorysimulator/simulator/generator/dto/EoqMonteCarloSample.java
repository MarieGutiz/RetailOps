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

package com.retailops.inventorysimulator.simulator.generator.dto;

import java.math.BigDecimal;
import java.math.BigInteger;

/**
 * Represents a single Monte Carlo sample for EOQ (Economic Order Quantity) simulations.
 *
 * <p>Includes the product label, demand (D), setup cost (S), and holding cost (H)
 * for the sampled scenario.</p>
 */
public record EoqMonteCarloSample(
        String productLabel,
        BigInteger demand,        // D
        BigDecimal setupCost,     // S
        BigDecimal holdingCost    // H
) {}
