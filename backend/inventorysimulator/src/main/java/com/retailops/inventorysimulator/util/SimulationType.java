package com.retailops.inventorysimulator.util;


import lombok.Getter;

@Getter
public enum SimulationType {

    EOQ("EOQ"),
    PROFIT("PROFIT"),
    NEWSVENDOR("NEWSVENDOR"),
    ABC("ABC ANALYSIS");

    private final String name;

    SimulationType(String name) {
        this.name = name;
    }



}
