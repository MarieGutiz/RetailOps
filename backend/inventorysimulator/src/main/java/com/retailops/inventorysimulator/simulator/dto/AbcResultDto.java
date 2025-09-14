package com.retailops.inventorysimulator.simulator.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class AbcResultDto {
    private String productName;
    private double salesValue;
    private String category; // "A", "B", "C"
}
