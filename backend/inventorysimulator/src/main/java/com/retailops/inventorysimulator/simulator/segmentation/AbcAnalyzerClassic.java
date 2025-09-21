
package com.retailops.inventorysimulator.simulator.segmentation;

import com.retailops.inventorysimulator.model.ABCResult;
import com.retailops.inventorysimulator.simulator.dto.AbcItemDto;
import com.retailops.inventorysimulator.simulator.dto.AbcRequestDto;
import com.retailops.inventorysimulator.util.SimulationType;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import static com.retailops.inventorysimulator.simulator.AbcAnalyzer.getAbcResults;

@Component
public class AbcAnalyzerClassic implements AbcAnalyzerStrategy {
    @Override
    public List<ABCResult> analyze(AbcRequestDto requestDto) {
        List<AbcItemDto> items = new ArrayList<>(requestDto.items());
        items.sort(Comparator.comparing(AbcItemDto::getSalesValue).reversed());

        BigDecimal totalSales = items.stream()
                .map(AbcItemDto::getSalesValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return getAbcResults(requestDto, items, totalSales);
    }

    @Override
    public SimulationType getType() {
        return SimulationType.ABC_CLASSIC;
    }
}
