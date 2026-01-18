package com.retailops.inventorysimulator.util;


import com.fasterxml.jackson.annotation.JsonCreator;
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

    @JsonCreator
    public static SimulationType fromJson(String value) {
        return fromString(value);
    }

}
