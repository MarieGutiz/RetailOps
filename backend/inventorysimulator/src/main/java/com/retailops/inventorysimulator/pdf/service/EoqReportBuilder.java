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

import com.retailops.inventorysimulator.pdf.dto.EoqCostCurveChart;
import com.retailops.inventorysimulator.pdf.dto.EoqPdfPayload;
import com.retailops.inventorysimulator.pdf.dto.EoqRequestPdf;
import com.retailops.inventorysimulator.pdf.model.AbstractReportBuilder;
import com.retailops.inventorysimulator.pdf.model.BaseReport;
import com.retailops.inventorysimulator.pdf.model.EoqReport;
import com.retailops.inventorysimulator.simulator.dto.EoqCurveResponseDto;
import com.retailops.inventorysimulator.simulator.dto.EoqResponseDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;


import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class EoqReportBuilder extends AbstractReportBuilder<EoqReport, EoqPdfPayload> {

    private final EoqChartService eoqChartService;

    @Override
    protected EoqReport createReport() {
        return new EoqReport();
    }

    @Override
    protected String getModelName() {
        return "eoq";
    }

    @Override
    protected String extractShopId(EoqPdfPayload context) {
        return context.request().getShopId();
    }

    @Override
    protected BaseReport.ReportHeader buildHeader(EoqPdfPayload context) {
        BaseReport.ReportHeader header = new BaseReport.ReportHeader();
        header.setTitle("Economic Order Quantity (EOQ) Analysis");
        header.setSubtitle(String.format("%s — %s",
                context.request().getProductName(),
                context.shopName()));
        header.setContext("Run on " + formatNow() +
                " • Optimal cost-minimizing replenishment policy");
        return header;
    }

    @Override
    protected List<BaseReport.Kpi> buildKpis(EoqPdfPayload context) {
        EoqResponseDto response = context.response();

        BaseReport.Kpi eoqKpi = new BaseReport.Kpi();
        eoqKpi.setLabel("Economic Order Quantity (Q*)");
        eoqKpi.setValue(String.valueOf(Math.round(response.eoq().doubleValue())));
        eoqKpi.setHint("Optimal order size minimizing total inventory cost");

        BaseReport.Kpi totalCostKpi = new BaseReport.Kpi();
        totalCostKpi.setLabel("Total Annual Cost");
        totalCostKpi.setValue(String.format("%.2f", response.totalCost()));

        BaseReport.Kpi orderingCostKpi = new BaseReport.Kpi();
        orderingCostKpi.setLabel("Ordering Cost");
        orderingCostKpi.setValue(String.format("%.2f", response.orderingCost()));

        BaseReport.Kpi holdingCostKpi = new BaseReport.Kpi();
        holdingCostKpi.setLabel("Holding Cost");
        holdingCostKpi.setValue(String.format("%.2f", response.holdingCost()));

        BaseReport.Kpi numOrdersKpi = new BaseReport.Kpi();
        numOrdersKpi.setLabel("Number of Orders / Year");
        numOrdersKpi.setValue(String.format("%.2f", response.numberOfOrders()));

        BaseReport.Kpi cycleTimeKpi = new BaseReport.Kpi();
        cycleTimeKpi.setLabel("Cycle Time");
        cycleTimeKpi.setValue(String.format("%.2f periods", response.cycleTime()));

        return List.of(eoqKpi, totalCostKpi, orderingCostKpi, holdingCostKpi, numOrdersKpi, cycleTimeKpi);
    }

    @Override
    protected List<BaseReport.ReportSection> buildSections(EoqPdfPayload context) {
        EoqRequestPdf request = context.request();
        EoqResponseDto response = context.response();

        List<BaseReport.ReportSection> sections = new ArrayList<>();

        // --- Input Parameters Section ---
        List<BaseReport.ReportParameter> parameters = List.of(
                new BaseReport.ReportParameter("Annual Demand (D)", String.valueOf(request.getDemand())),
                new BaseReport.ReportParameter("Setup Cost (S)", request.getCost().toString(), true),
                new BaseReport.ReportParameter("Holding Cost (H)", request.getHoldingCost().toString(), true)
        );
        BaseReport.ReportSection inputSection = new BaseReport.ReportSection();
        inputSection.setTitle("Input Parameters");
        inputSection.setType(BaseReport.ReportSection.SectionType.PARAMETERS);
        inputSection.setPayload(parameters);

        // --- EOQ Cost Curve Chart Section ---
        BaseReport.ReportSection costChartSection = new BaseReport.ReportSection();
        costChartSection.setTitle("EOQ Cost Curve");
        costChartSection.setType(BaseReport.ReportSection.SectionType.CHART);

        try {
            String base64Png = eoqChartService.generateCostCurveBase64Png(
                    request.getDemand().doubleValue(),
                    request.getCost().doubleValue(),
                    request.getHoldingCost().doubleValue(),
                    response.eoq().doubleValue()
            );

            EoqCostCurveChart chart = new EoqCostCurveChart(
                    request.getDemand(),
                    request.getCost(),
                    request.getHoldingCost(),
                    response.eoq(),
                    base64Png
            );

            String imgHtml = "<img src=\"data:image/png;base64," + chart.getBase64Png() +
                    "\" width=\"450\" height=\"250\" style=\"display:block; margin:auto;\"/>";
            costChartSection.setPayload(imgHtml);

        } catch (Exception e) {
            String svg = eoqChartService.generateCostCurveSvg(
                    request.getDemand().doubleValue(),
                    request.getCost().doubleValue(),
                    request.getHoldingCost().doubleValue(),
                    450,
                    250
            );
            costChartSection.setPayload(svg);
        }

        // --- Interpretation Section ---
        BaseReport.ReportSection interpretationSection = buildInterpretationSection(response);

        // --- Assemble Sections ---
        sections.add(inputSection);
        sections.add(costChartSection);
        sections.add(interpretationSection);

        return sections;
    }

    @Override
    protected void applyModelSpecificFields(EoqReport report, EoqPdfPayload context) {
        EoqResponseDto response = context.response();
        report.setOptimalQuantity(response.eoq());
        report.setTotalAnnualCost(response.totalCost());
        report.setOrderingCost(response.orderingCost());
        report.setHoldingCost(response.holdingCost());
        report.setNumberOfOrdersPerYear(response.numberOfOrders());
        report.setCycleTime(response.cycleTime());
    }

    private BaseReport.ReportSection buildInterpretationSection(EoqResponseDto response) {
        double ratio = response.orderingCost().doubleValue() /
                (response.holdingCost().doubleValue() != 0 ? response.holdingCost().doubleValue() : 1);

        String text;
        if (ratio > 1) {
            text = "Ordering costs outweigh holding costs. Increasing order quantities reduces total cost exposure by minimizing setup frequency.";
        } else if (ratio < 1) {
            text = "Holding costs dominate ordering costs. Smaller and more frequent replenishments help reduce capital lock-in.";
        } else {
            text = "Ordering and holding costs are balanced. The EOQ reflects an equilibrium between setup frequency and inventory carrying cost.";
        }

        BaseReport.ReportSection section = new BaseReport.ReportSection();
        section.setTitle("Cost Structure Interpretation");
        section.setType(BaseReport.ReportSection.SectionType.TEXT);
        section.setPayload(text);
        return section;
    }

}
