package com.retailops.inventorysimulator.simulator.dto;

import lombok.*;

@Getter
@Setter
@RequiredArgsConstructor
public class AbcItemDto {
    private String productName;
    private double salesValue;
}
