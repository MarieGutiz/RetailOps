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

import com.retailops.inventorysimulator.pdf.dto.NewsvendorRequestPdf;
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

@SpringBootTest
class NewsvendorPdfTest {

    @Autowired
    private NewsvendorReportBuilder reportBuilder;

    @Autowired
    private ReportPDFService pdfService;

    @Test
    void generatePdfLocally() throws Exception {

        // 1. Build a sample request
        NewsvendorRequestPdf request = NewsvendorRequestPdf.builder()
                .model(SimulationType.NEWSVENDOR)
                .productName("Widget X")
                .shopId("SHOP-123")
                .createdAt(LocalDateTime.now())
                .meanDemand(100.0)
                .stdDeviation(20.0)
                .price(BigDecimal.valueOf(50.0))
                .cost(BigDecimal.valueOf(30.0))
                .salvageValue(BigDecimal.valueOf(5.0))
                .penalty(BigDecimal.valueOf(0.0))
                .mode("CLASSIC")
                .simulationRuns(1000)
                .build();

        // 2. Build a stub NewsvendorResponse
        var response = new com.retailops.inventorysimulator.simulator.dto.NewsvendorResponse(
                request.getProductName(),
                BigDecimal.valueOf(0.75), // critical ratio
                BigInteger.valueOf(105),  // optimal order quantity
                BigDecimal.valueOf(1500.0), // expected profit
                BigDecimal.valueOf(0.95)    // service level
        );

        // 3. Build report using the builder and  Generate PDF bytes
        byte[] pdfBytes = pdfService.generatePdf(request, response);

        // 5. Write it locally for inspection
        Files.write(Paths.get("target/newsvendor-test.pdf"), pdfBytes);

        System.out.println("PDF generated at target/newsvendor-test.pdf");
    }

}
