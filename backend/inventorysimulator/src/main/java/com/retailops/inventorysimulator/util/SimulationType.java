package com.retailops.inventorysimulator.util;


import lombok.Getter;

import java.util.Arrays;

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


}
