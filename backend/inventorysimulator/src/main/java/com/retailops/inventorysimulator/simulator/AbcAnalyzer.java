package com.retailops.inventorysimulator.simulator;

import com.retailops.inventorysimulator.model.ABCResult;
import com.retailops.inventorysimulator.simulator.dto.AbcItemDto;
import com.retailops.inventorysimulator.simulator.dto.AbcRequestDto;
import com.retailops.inventorysimulator.simulator.segmentation.AbcAnalyzerStrategy;
import com.retailops.inventorysimulator.util.ABCCategoryType;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class AbcAnalyzer {

    public static List<ABCResult> getAbcResults(AbcRequestDto requestDto, List<AbcItemDto> items, BigDecimal totalSales) {
        BigDecimal cumulative = BigDecimal.ZERO;
        List<ABCResult> results = new ArrayList<>();
        int rank = 1;

        for (AbcItemDto item : items) {
            cumulative = cumulative.add(item.getSalesValue());
            BigDecimal contribution = cumulative
                    .divide(totalSales, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));

            ABCCategoryType category;
            if (contribution.compareTo(AbcAnalyzerStrategy.CLASS_A) <= 0) {
                category = ABCCategoryType.A;
            } else if (contribution.compareTo(AbcAnalyzerStrategy.CLASS_B) <= 0) {
                category = ABCCategoryType.B;
            } else {
                category = ABCCategoryType.C;
            }

            ABCResult result = new ABCResult();
            result.setProductName(item.getProductName());
            result.setAbcClass(category);
            result.setContributionPercentage(contribution);
            result.setRank(rank++);
            result.setUsername(requestDto.username());
            result.setAnalyzedAt(LocalDateTime.now());

            results.add(result);
        }

        return results;
    }
}

