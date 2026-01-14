
package com.retailops.inventorysimulator.simulator.segmentation;

import com.retailops.inventorysimulator.simulator.dto.AbcItemDto;
import com.retailops.inventorysimulator.simulator.dto.AbcRequestDto;
import com.retailops.inventorysimulator.simulator.floristshop.abc.analyzer.AbcRankedItem;
import com.retailops.inventorysimulator.util.SimulationType;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Component
public class AbcAnalyzerClassic extends AbstractAbcAnalyzer implements AbcAnalyzerStrategy {

    @Override
    public List<AbcRankedItem> analyze(AbcRequestDto requestDto) {
        List<AbcItemDto> items = new ArrayList<>(requestDto.items());

        // Sort items by salesValue descending (classic ABC)
        items.sort((i1, i2) -> i2.getSalesValue().compareTo(i1.getSalesValue()));

        // Compute total sales for ranking & cumulative percentage
        BigDecimal totalSales = totalSales(items);

        // Rank items and assign ABC class
        return rank(items, totalSales);

    }

    @Override
    public SimulationType getType() {
        return SimulationType.ABC_CLASSIC;
    }
}
