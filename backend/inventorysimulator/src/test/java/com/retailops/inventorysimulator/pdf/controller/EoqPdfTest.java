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

import com.retailops.inventorysimulator.pdf.dto.EoqPdfPayload;
import com.retailops.inventorysimulator.pdf.dto.EoqRequestPdf;
import com.retailops.inventorysimulator.pdf.model.EoqReport;
import com.retailops.inventorysimulator.pdf.service.EoqReportBuilder;
import com.retailops.inventorysimulator.pdf.service.ReportPDFService;
import com.retailops.inventorysimulator.simulator.dto.EoqCurvePointDto;
import com.retailops.inventorysimulator.simulator.dto.EoqCurveResponseDto;
import com.retailops.inventorysimulator.simulator.dto.EoqResponseDto;
import com.retailops.inventorysimulator.util.types.SimulationType;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;

@SpringBootTest
class EoqPdfTest {

    @Autowired
    private EoqReportBuilder reportBuilder;

    @Autowired
    private ReportPDFService pdfService;

    @Test
    void generatePdfLocally() throws Exception {

        // 1. Build EOQ request
        EoqRequestPdf request = EoqRequestPdf.builder()
                .model(SimulationType.EOQ)
                .productName("Wireless Headphones")
                .sku("WH-001")
                .shopId("SHOP-123")
                .shopName("My Shop")
                .createdAt(LocalDateTime.now())
                .demand(BigDecimal.valueOf(1000))
                .cost(BigDecimal.valueOf(50))
                .holdingCost(BigDecimal.valueOf(5))
                .build();

        // 2. Stub EOQ response
        EoqResponseDto response = new EoqResponseDto(
                request.getProductName(),       // product
                BigInteger.valueOf(1000),      // demand
                request.getCost(),              // setupCost
                request.getHoldingCost(),       // holdingCost
                BigDecimal.valueOf(200),        // eoq
                BigDecimal.valueOf(5000),       // orderingCost
                BigDecimal.valueOf(2500),       // holdingCostTotal
                BigDecimal.valueOf(7500),       // totalCost
                BigDecimal.valueOf(5),          // numberOfOrders
                BigDecimal.valueOf(2)           // cycleTime
        );

        // 3. Stub EOQ curve
        List<EoqCurvePointDto> curvePoints = List.of(
                new EoqCurvePointDto(BigDecimal.valueOf(50), BigDecimal.valueOf(5500), BigDecimal.valueOf(1250), BigDecimal.valueOf(6750)),
                new EoqCurvePointDto(BigDecimal.valueOf(200), BigDecimal.valueOf(5000), BigDecimal.valueOf(2500), BigDecimal.valueOf(7500)),
                new EoqCurvePointDto(BigDecimal.valueOf(350), BigDecimal.valueOf(5200), BigDecimal.valueOf(4375), BigDecimal.valueOf(9575))
        );
        EoqCurveResponseDto curve = new EoqCurveResponseDto(BigDecimal.valueOf(200), curvePoints);

        // 4. Create payload
        EoqPdfPayload payload = new EoqPdfPayload(request, response, curve, request.getShopName());

        // 5. Build report
        EoqReport report = reportBuilder.build(payload);

        // 6. Generate PDF using EOQ template
        byte[] pdfBytes = pdfService.generatePdf(report, "pdf/eoq-report");

        // 7. Save locally
        Files.write(Paths.get("target/eoq-test.pdf"), pdfBytes);

        System.out.println("PDF generated at target/eoq-test.pdf");
    }
}
