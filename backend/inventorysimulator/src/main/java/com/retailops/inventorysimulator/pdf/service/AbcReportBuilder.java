/*
 *
 *  * Copyright (c) 2026
 *  * Author: Mariela Paola Gutierrez
 *  * Repository: https://github.com/mariegutiz
 *  *
 *  * Licensed under the MIT License. You may obtain a copy of the License at:
 *  *     https://opensource.org/licenses/MIT
 *  *
 *  *
 *  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 *
 *
 */

package com.retailops.inventorysimulator.pdf.service;

import com.retailops.inventorysimulator.pdf.dto.AbcItemRow;
import com.retailops.inventorysimulator.pdf.dto.AbcPdfPayload;
import com.retailops.inventorysimulator.pdf.dto.AbcRequestPdf;
import com.retailops.inventorysimulator.pdf.model.AbcReport;
import com.retailops.inventorysimulator.pdf.model.AbstractReportBuilder;
import com.retailops.inventorysimulator.pdf.model.BaseReport;
import com.retailops.inventorysimulator.simulator.dto.AbcResponseDto;
import com.retailops.inventorysimulator.simulator.dto.AbcSummaryDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@AllArgsConstructor
public class AbcReportBuilder extends AbstractReportBuilder<AbcReport, AbcPdfPayload> {
private final AbcAnalysisService abcAnalysisService; // service that runs the ABC analysis

    @Override
    protected AbcReport createReport() {
        return new AbcReport();
    }

    @Override
    protected String getModelName() {
        return "abc";
    }

    @Override
    protected String extractShopId(AbcPdfPayload context) {
        return context.request().getShopId();
    }

    @Override
    protected BaseReport.ReportHeader buildHeader(AbcPdfPayload context) {
        AbcRequestPdf request = context.request();

        BaseReport.ReportHeader header = new BaseReport.ReportHeader();
        header.setTitle("ABC Inventory Analysis");
        header.setSubtitle(String.format("Mode: %s — Shop: %s", request.getMode(), context.shopName()));
        header.setContext("Simulation generated at " + formatNow());
        return header;
    }

    @Override
    protected List<BaseReport.Kpi> buildKpis(AbcPdfPayload context) {
        AbcRequestPdf request = context.request();
        AbcResponseDto response = abcAnalysisService.analyze(request.getItems(), request.getMode());
        AbcSummaryDto summary = response.summary();

        BaseReport.Kpi totalValueKpi = new BaseReport.Kpi();
        totalValueKpi.setLabel("Total Inventory Value");
        totalValueKpi.setValue(summary.getTotalValue().toPlainString());

        BaseReport.Kpi aKpi = new BaseReport.Kpi();
        aKpi.setLabel("A Items Count");
        aKpi.setValue(String.valueOf(summary.getA().getCount()));
        aKpi.setHint(summary.getA().getValuePct().setScale(1, BigDecimal.ROUND_HALF_UP) + "% of total value");

        BaseReport.Kpi bKpi = new BaseReport.Kpi();
        bKpi.setLabel("B Items Count");
        bKpi.setValue(String.valueOf(summary.getB().getCount()));
        bKpi.setHint(summary.getB().getValuePct().setScale(1, BigDecimal.ROUND_HALF_UP) + "% of total value");

        BaseReport.Kpi cKpi = new BaseReport.Kpi();
        cKpi.setLabel("C Items Count");
        cKpi.setValue(String.valueOf(summary.getC().getCount()));
        cKpi.setHint(summary.getC().getValuePct().setScale(1, BigDecimal.ROUND_HALF_UP) + "% of total value");

        return List.of(totalValueKpi, aKpi, bKpi, cKpi);
    }

    @Override
    protected List<BaseReport.ReportSection> buildSections(AbcPdfPayload context) {
        AbcRequestPdf request = context.request();
        AbcResponseDto response = abcAnalysisService.analyze(request.getItems(), request.getMode());

        // --- 1. Input Parameters ---
        List<BaseReport.ReportParameter> parameters = List.of(
                new BaseReport.ReportParameter("Mode", request.getMode().getName()),
                new BaseReport.ReportParameter("Number of Items", String.valueOf(request.getItems().size()))
        );
       System.out.println("parameters "+ parameters);
        BaseReport.ReportSection inputSection = new BaseReport.ReportSection();
        inputSection.setTitle("Input Parameters");
        inputSection.setType(BaseReport.ReportSection.SectionType.PARAMETERS);
        inputSection.setPayload(parameters);

        // --- 2. ABC Items Table ---
//        List<Map<String, Object>> itemTable = response.items().stream()
//                .map(i -> Map.<String, Object>of(
//                        "Product", i.getProduct().getName(),
//                        "SKU", i.getProduct().getSku(),
//                        "Sales Value", i.getSalesValue(),
//                        "Demand Frequency", i.getDemandFrequency(),
//                        "ABC Category", i.getAbcCategoryType(),
//                        "Rank", i.getRank(),
//                        "Cumulative %", i.getCumulativePct()
//                ))
//                .toList();
        List<AbcItemRow> itemTable = response.items().stream()
                .map(i -> new AbcItemRow(
                        i.getProduct().getName(),
                        i.getProduct().getSku(),
                        i.getAbcCategoryType(),
                        i.getRank(),
                        i.getSalesValue(),
                        i.getDemandFrequency(),
                        i.getCumulativePct()
                ))
                .toList();

        System.out.println("itemTable "+ itemTable);
        BaseReport.ReportSection tableSection = new BaseReport.ReportSection();
        tableSection.setTitle("ABC Summary Table");
        tableSection.setType(BaseReport.ReportSection.SectionType.TABLE);
        tableSection.setPayload(itemTable);

        // --- 3. Interpretation ---
        BaseReport.ReportSection interpretationSection = new BaseReport.ReportSection();
        interpretationSection.setTitle("Interpretation");
        interpretationSection.setType(BaseReport.ReportSection.SectionType.TEXT);
        interpretationSection.setPayload(
                "Category A items are high-value and should receive priority management. " +
                        "B items are moderate value; C items are low-value, low-frequency inventory."
        );

        return List.of(inputSection, tableSection, interpretationSection);
    }

    @Override
    protected void applyModelSpecificFields(AbcReport report, AbcPdfPayload context) {
        // Optional: store summary counts in the ABC-specific fields
        AbcResponseDto response = abcAnalysisService.analyze(context.request().getItems(), context.request().getMode());
        AbcSummaryDto summary = response.summary();

        report.setTotalInventoryValue(summary.getTotalValue());
        report.setAItemsCount(summary.getA().getCount());
        report.setBItemsCount(summary.getB().getCount());
        report.setCItemsCount(summary.getC().getCount());
    }

}
