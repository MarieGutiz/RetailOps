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
