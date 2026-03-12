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

package com.retailops.inventorysimulator.pdf.controller;

import com.retailops.inventorysimulator.pdf.dto.NewsvendorPdfPayload;
import com.retailops.inventorysimulator.pdf.dto.NewsvendorRequestPdf;
import com.retailops.inventorysimulator.pdf.model.NewsvendorReport;
import com.retailops.inventorysimulator.pdf.service.NewsvendorReportBuilder;
import com.retailops.inventorysimulator.pdf.service.ReportPDFService;
import com.retailops.inventorysimulator.util.types.SimulationType;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;

/**
 * Integration tests for generating Newsvendor simulation PDF reports.
 *
 * <p>This test verifies that the reporting pipeline correctly builds
 * Newsvendor analysis reports and renders them into PDF format.</p>
 *
 * <p>The test constructs a sample Newsvendor request with demand
 * parameters, stubs a corresponding response, and creates a payload.
 * It then builds a report using {@link NewsvendorReportBuilder} and
 * generates the final PDF through {@link ReportPDFService}.</p>
 *
 * <p>The resulting file is written to the {@code target/} directory
 * for manual inspection.</p>
 */
@SpringBootTest
class NewsvendorPdfTest {

    @Autowired
    private NewsvendorReportBuilder reportBuilder;

    @Autowired
    private ReportPDFService pdfService;

    @Test
    void generatePdfLocally() throws Exception {

        // 1 Build request
        NewsvendorRequestPdf request = NewsvendorRequestPdf.builder()
                .model(SimulationType.NEWSVENDOR)
                .productName("Wireless Headphones")
                .sku("WH-001")
                .shopId("SHOP-123")
                .shopName("My Shop")
                .createdAt(LocalDateTime.now())
                .meanDemand(100.0)
                .stdDeviation(20.0)
                .price(BigDecimal.valueOf(50.0))
                .cost(BigDecimal.valueOf(30.0))
                .salvageValue(BigDecimal.valueOf(5.0))
                .penalty(BigDecimal.ZERO)
                .build();

        // 2 Stub response
        var response = new com.retailops.inventorysimulator.simulator.dto.NewsvendorResponse(
                request.getProductName(),
                BigDecimal.valueOf(0.75),
                BigInteger.valueOf(105),
                BigDecimal.valueOf(1500.0),
                BigDecimal.valueOf(0.95)
        );

        // 3 Create payload
        NewsvendorPdfPayload payload =
                new NewsvendorPdfPayload(request, response);

        // 4 Build report
        NewsvendorReport report = reportBuilder.build(payload);

        // 5 Generate PDF using correct template
        byte[] pdfBytes = pdfService.generatePdf(
                report,
                "pdf/newsvendor-report"
        );

        // 6 Save locally
        Files.write(Paths.get("target/newsvendor-test.pdf"), pdfBytes);

        System.out.println("PDF generated at target/newsvendor-test.pdf");
    }


}
