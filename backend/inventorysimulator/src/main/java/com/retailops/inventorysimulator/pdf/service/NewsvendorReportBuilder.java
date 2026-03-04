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

import com.retailops.inventorysimulator.pdf.dto.DemandRiskChart;
import com.retailops.inventorysimulator.pdf.dto.NewsvendorPdfPayload;
import com.retailops.inventorysimulator.pdf.dto.NewsvendorRequestPdf;
import com.retailops.inventorysimulator.pdf.model.AbstractReportBuilder;
import com.retailops.inventorysimulator.pdf.model.BaseReport;
import com.retailops.inventorysimulator.pdf.model.NewsvendorReport;
import com.retailops.inventorysimulator.simulator.dto.NewsvendorResponse;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;



@Service
@AllArgsConstructor
public class NewsvendorReportBuilder
        extends AbstractReportBuilder<NewsvendorReport, NewsvendorPdfPayload> {

    private final NewsvendorChartService chartService;


    @Override
    protected NewsvendorReport createReport() {
        return new NewsvendorReport();
    }

    @Override
    protected String getModelName() {
        return "newsvendor";
    }

    @Override
    protected String extractShopId(NewsvendorPdfPayload context) {
        return context.request().getShopId();
    }

    @Override
    protected BaseReport.ReportHeader buildHeader(NewsvendorPdfPayload context) {

        NewsvendorRequestPdf request = context.request();

        BaseReport.ReportHeader header = new BaseReport.ReportHeader();
        header.setTitle("Newsvendor Analysis");

        header.setSubtitle(String.format(
                "%s (SKU: %s) — Shop: %s",
                request.getProductName(),
                request.getSku(),
                request.getShopName()
        ));

        header.setContext(String.format(
                "Generated on %s • Single-period stochastic demand model",
                formatNow()
        ));

        return header;
    }

    @Override
    protected List<BaseReport.Kpi> buildKpis(NewsvendorPdfPayload context) {

        NewsvendorResponse response = context.response();
        double serviceLevel = response.serviceLevel().doubleValue();

        BaseReport.Kpi optimalQty = new BaseReport.Kpi();
        optimalQty.setLabel("Optimal Quantity (Q*)");
        optimalQty.setValue(String.valueOf(
                Math.round(response.optimalOrderQuantity().doubleValue())
        ));
        optimalQty.setHint("Profit-maximizing order quantity");

        BaseReport.Kpi expectedProfit = new BaseReport.Kpi();
        expectedProfit.setLabel("Expected Profit");
        expectedProfit.setValue(String.format("%.2f", response.expectedProfit()));
        expectedProfit.setSeverity(
                response.expectedProfit().doubleValue() > 0
                        ? BaseReport.Kpi.Severity.POSITIVE
                        : BaseReport.Kpi.Severity.WARNING
        );

        BaseReport.Kpi serviceLevelKpi = new BaseReport.Kpi();
        serviceLevelKpi.setLabel("Service Level Achieved");
        serviceLevelKpi.setValue(String.format("%.2f%%", serviceLevel * 100));

        BaseReport.Kpi stockout = new BaseReport.Kpi();
        stockout.setLabel("Stockout Probability");
        stockout.setValue(String.format("%.2f%%", (1 - serviceLevel) * 100));
        stockout.setSeverity(
                (1 - serviceLevel) > 0.20
                        ? BaseReport.Kpi.Severity.CRITICAL
                        : BaseReport.Kpi.Severity.NEUTRAL
        );

        return List.of(optimalQty, expectedProfit, serviceLevelKpi, stockout);
    }

    @Override
    protected List<BaseReport.ReportSection> buildSections(NewsvendorPdfPayload context) {

        NewsvendorRequestPdf request = context.request();
        NewsvendorResponse response = context.response();

        double serviceLevel = response.serviceLevel().doubleValue();

        // --- 1. Input Parameters ---
        List<BaseReport.ReportParameter> parameters = List.of(
                new BaseReport.ReportParameter("Mean Demand", String.valueOf(request.getMeanDemand())),
                new BaseReport.ReportParameter("Standard Deviation", String.valueOf(request.getStdDeviation())),
                new BaseReport.ReportParameter("Selling Price", request.getPrice().toString(), true),
                new BaseReport.ReportParameter("Unit Cost", request.getCost().toString(), true),
                new BaseReport.ReportParameter("Salvage Value", request.getSalvageValue().toString(), true),
                new BaseReport.ReportParameter("Penalty Cost", request.getPenalty().toString(), true)
        );

        BaseReport.ReportSection inputParamsSection = new BaseReport.ReportSection();
        inputParamsSection.setTitle("Input Parameters");
        inputParamsSection.setType(BaseReport.ReportSection.SectionType.PARAMETERS);
        inputParamsSection.setPayload(parameters);

        // --- 2. Risk Distribution Chart ---
        BaseReport.ReportSection riskChart = new BaseReport.ReportSection();
        riskChart.setTitle("Risk Distribution");
        riskChart.setType(BaseReport.ReportSection.SectionType.CHART);

        BigDecimal mean = BigDecimal.valueOf(request.getMeanDemand());
        BigDecimal std = BigDecimal.valueOf(request.getStdDeviation());
        BigDecimal sl = response.serviceLevel();

        double criticalValueDouble = chartService.inverseCDF(
                sl.doubleValue(),
                mean.doubleValue(),
                std.doubleValue()
        );

        BigDecimal criticalValue = BigDecimal.valueOf(criticalValueDouble);

        try {

            String base64Png = chartService.generateRiskDistributionBase64Png(
                    mean.doubleValue(),
                    std.doubleValue(),
                    sl.doubleValue()
            );

            DemandRiskChart demandRiskChart = new DemandRiskChart(
                    mean,
                    std,
                    sl,
                    criticalValue,
                    base64Png
            );

            String imgHtml = "<img src=\"data:image/png;base64," +
                    demandRiskChart.getBase64Png() +
                    "\" width=\"450\" height=\"250\" style=\"display:block; margin:auto;\"/>";

            riskChart.setPayload(imgHtml);

        } catch (Exception e) {

            String svg = chartService.generateRiskDistributionSvg(
                    mean.doubleValue(),
                    std.doubleValue(),
                    sl.doubleValue(),
                    450,
                    250
            );

            riskChart.setPayload(svg);
        }

        // --- 3. Interpretation ---
        BaseReport.ReportSection interpretation = new BaseReport.ReportSection();
        interpretation.setTitle("Interpretation");
        interpretation.setType(BaseReport.ReportSection.SectionType.TEXT);
        interpretation.setPayload(
                (1 - serviceLevel) > 0.20
                        ? "High stockout probability. Consider increasing service level to reduce unmet demand risk."
                        : "Risk profile within acceptable operational range."
        );

        return List.of(inputParamsSection, riskChart, interpretation);
    }

}
