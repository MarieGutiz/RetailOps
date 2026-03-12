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

import java.util.Map;

/**
 * Represents the results of a profit distribution simulation.
 *
 * <p>Includes a histogram of profit occurrences, expected profit, variance,
 * probability of loss, and the minimum and maximum profit values observed.</p>
 */
public record ProfitDistributionResult(
        Map<Integer, Integer> histogram,
        double expectedProfit,
        double variance,
        double probabilityOfLoss,
        double minProfit,
        double maxProfit

) {
}
