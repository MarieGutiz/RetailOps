package com.retailops.inventorysimulator.util;


import lombok.Getter;

@Getter
public enum SimulationType {

    EOQ("EOQ"),
    PROFIT("PROFIT"),
    NEWSVENDOR("NEWSVENDOR"),
    ABC_CLASSIC("ABC ANALYSIS"),
    ABC_MULTI("ABC MULTIPLE"),;

    private final String name;

    SimulationType(String name) {
        this.name = name;
    }



}
