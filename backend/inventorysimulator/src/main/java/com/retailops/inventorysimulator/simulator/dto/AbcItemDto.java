package com.retailops.inventorysimulator.simulator.dto;

import lombok.*;

import java.math.BigDecimal;
import java.math.BigInteger;

@Getter
@Setter
@RequiredArgsConstructor
public class AbcItemDto {
    private String productName;
    BigDecimal salesValue;
    BigInteger demandFrequency;
}
