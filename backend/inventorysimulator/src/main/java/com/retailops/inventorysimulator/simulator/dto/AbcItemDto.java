package com.retailops.inventorysimulator.simulator.dto;

import lombok.*;

import java.math.BigDecimal;
import java.math.BigInteger;

@Getter
@Setter
@RequiredArgsConstructor
@ToString
@Data
public class AbcItemDto {
    private String productName;
    String sku;
    BigDecimal salesValue;
    BigInteger demandFrequency;

}
