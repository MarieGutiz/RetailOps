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

package com.retailops.inventorysimulator.util.types;


import com.fasterxml.jackson.annotation.JsonCreator;
import lombok.Getter;

/**
 * Enumerates the supported inventory simulation types within the system.
 *
 * <p>Each simulation type represents a different analytical model used to
 * evaluate inventory strategies and performance:</p>
 * <ul>
 *   <li>EOQ – Economic Order Quantity optimization</li>
 *   <li>PROFIT – Profit-based inventory evaluation</li>
 *   <li>NEWSVENDOR – Single-period stochastic demand optimization</li>
 *   <li>ABC_CLASSIC – Traditional ABC inventory classification</li>
 *   <li>ABC_MULTI – Multi-criteria ABC classification</li>
 * </ul>
 *
 * <p>The enum also provides utility methods for converting string or JSON
 * values into the corresponding {@code SimulationType}.</p>
 */
@Getter
public enum SimulationType {

    EOQ("EOQ"),
    PROFIT("PROFIT"),
    NEWSVENDOR("NEWSVENDOR"),
    ABC_CLASSIC("ABC_CLASSIC"),
    ABC_MULTI("ABC_MULTI");

    private final String name;

    SimulationType(String name) {
        this.name = name;
    }

    public static SimulationType fromString(String value) {
        return switch (value.toUpperCase()) {
            case "CLASSIC" -> ABC_CLASSIC;
            case "MULTI" -> ABC_MULTI;
            case "EOQ" -> EOQ;
            case "PROFIT" -> PROFIT;
            case "NEWSVENDOR" -> NEWSVENDOR;
            default -> throw new IllegalArgumentException("Invalid SimulationType: " + value);
        };
    }

    @JsonCreator
    public static SimulationType fromJson(String value) {
        return fromString(value);
    }

}
