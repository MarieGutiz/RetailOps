package com.retailops.inventorysimulator.simulator.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@RequiredArgsConstructor
public class AbcItemDto {
    private String productName;
    private BigDecimal salesValue;
}
