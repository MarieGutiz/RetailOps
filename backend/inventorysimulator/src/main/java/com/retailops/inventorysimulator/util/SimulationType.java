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
}
