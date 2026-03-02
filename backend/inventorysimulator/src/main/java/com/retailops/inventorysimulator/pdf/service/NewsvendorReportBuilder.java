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

import com.retailops.inventorysimulator.pdf.dto.NewsvendorRequestPdf;
import com.retailops.inventorysimulator.pdf.model.BaseReport;
import com.retailops.inventorysimulator.pdf.model.NewsvendorReport;
import com.retailops.inventorysimulator.simulator.dto.NewsvendorResponse;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;



@Service
@AllArgsConstructor
public class NewsvendorReportBuilder {
    private final NewsvendorChartService newsvendorChartService;

    public NewsvendorReport buildFromRequest(
            NewsvendorRequestPdf request,
            NewsvendorResponse response) {
        NewsvendorReport report = new NewsvendorReport();

        // --- 0. Setup defaults: watermark & GitHub link ---
        report.setupDefaults();


        // --- 1. Use actual service level from response ---
        double serviceLevel = response.serviceLevel().doubleValue();
        report.setServiceLevel(serviceLevel);

        // --- 2. Base report info ---
        report.setModel("newsvendor");
        report.setShopId(request.getShopId());
        report.setGeneratedAt(LocalDateTime.now());

        // --- 3. Header ---
        BaseReport.ReportHeader header = new BaseReport.ReportHeader();
        header.setTitle("Newsvendor Analysis");
        header.setSubtitle(request.getProductName());
        header.setContext("Generated at " + LocalDateTime.now());
        report.setHeader(header);

        // --- 4. KPIs ---
        BaseReport.Kpi optimalQty = new BaseReport.Kpi();
        optimalQty.setLabel("Optimal Quantity (Q*)");
        optimalQty.setValue(String.valueOf(Math.round(response.optimalOrderQuantity().doubleValue())));
        optimalQty.setHint("Profit-maximizing order quantity");

        BaseReport.Kpi expectedProfit = new BaseReport.Kpi();
        expectedProfit.setLabel("Expected Profit");
        expectedProfit.setValue(String.format("%.2f", response.expectedProfit()));
        expectedProfit.setSeverity(response.expectedProfit().doubleValue() > 0
                ? BaseReport.Kpi.Severity.POSITIVE
                : BaseReport.Kpi.Severity.WARNING);

        BaseReport.Kpi serviceLevelKpi = new BaseReport.Kpi();
        serviceLevelKpi.setLabel("Service Level Achieved");
        serviceLevelKpi.setValue(String.format("%.2f%%", serviceLevel * 100));

        BaseReport.Kpi stockout = new BaseReport.Kpi();
        stockout.setLabel("Stockout Probability");
        stockout.setValue(String.format("%.2f%%", (1 - serviceLevel) * 100));
        stockout.setSeverity((1 - serviceLevel) > 0.20
                ? BaseReport.Kpi.Severity.CRITICAL
                : BaseReport.Kpi.Severity.NEUTRAL);

        report.setKpis(List.of(optimalQty, expectedProfit, serviceLevelKpi, stockout));

        // --- 5. Sections ---
        BaseReport.ReportSection inputParams = new BaseReport.ReportSection();
        inputParams.setTitle("Input Parameters");
        inputParams.setType(BaseReport.ReportSection.SectionType.TABLE);
        inputParams.setPayload(request);

        //Add chart
        // --- 5. Sections ---
        BaseReport.ReportSection riskChart = new BaseReport.ReportSection();
        riskChart.setTitle("Risk Distribution");
        riskChart.setType(BaseReport.ReportSection.SectionType.CHART);

        try {
            // Generate Base64 PNG for PDF embedding
            String base64Png = newsvendorChartService.generateRiskDistributionBase64Png(
                    request.getMeanDemand(),
                    request.getStdDeviation(),
                    serviceLevel
            );

            // Wrap in <img> tag for PDF/HTML usage
            String imgHtml = "<img src=\"data:image/png;base64," + base64Png + "\" width=\"450\" height=\"250\" style=\"display:block; margin:auto;\"/>";
            riskChart.setPayload(imgHtml);

        } catch (Exception e) {
            // fallback: use SVG if PNG generation fails
            String svg = newsvendorChartService.generateRiskDistributionSvg(
                    request.getMeanDemand(),
                    request.getStdDeviation(),
                    serviceLevel,
                    450,
                    250
            );
            riskChart.setPayload(svg);
        }


        //Insight
        BaseReport.ReportSection interpretation = new BaseReport.ReportSection();
        interpretation.setTitle("Interpretation");
        interpretation.setType(BaseReport.ReportSection.SectionType.TEXT);
        interpretation.setPayload((1 - serviceLevel) > 0.20
                ? "High stockout probability. Consider increasing service level to reduce unmet demand risk."
                : "Risk profile within acceptable operational range.");

        report.setSections(List.of(inputParams, riskChart, interpretation));

        // --- 6. Newsvendor-specific fields ---
        report.setOptimalQuantity(Math.round(response.optimalOrderQuantity().longValue()));
        report.setExpectedProfit(response.expectedProfit().doubleValue());
        report.setStockoutProbability(1 - serviceLevel);

        return report;


    }


}
