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

import com.retailops.inventorysimulator.model.Product;
import com.retailops.inventorysimulator.pdf.dto.AbcPdfPayload;
import com.retailops.inventorysimulator.pdf.dto.AbcRequestPdf;
import com.retailops.inventorysimulator.pdf.model.AbcReport;
import com.retailops.inventorysimulator.pdf.service.AbcReportBuilder;
import com.retailops.inventorysimulator.pdf.service.ReportPDFService;
import com.retailops.inventorysimulator.simulator.dto.AbcItemDto;
import com.retailops.inventorysimulator.util.types.SimulationType;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

@SpringBootTest
class AbcPdfTest {

    @Autowired
    private AbcReportBuilder reportBuilder;

    @Autowired
    private ReportPDFService pdfService;

    @Test
    void generateClassicAbcPdf() throws Exception {
        generateAbcPdf(SimulationType.ABC_CLASSIC, "abc-classic-test.pdf");
    }

    @Test
    void generateMultiAbcPdf() throws Exception {
        generateAbcPdf(SimulationType.ABC_MULTI, "abc-multi-test.pdf");
    }

    private void generateAbcPdf(SimulationType mode, String fileName) throws Exception {

        // --- 1. Build products ---
        Product product1 = Product.builder()
                .sku("P001")
                .name("Wireless Headphones")
                .category("Electronics")
                .unitCost(BigDecimal.valueOf(150))
                .unitPrice(BigDecimal.valueOf(250))
                .description("High-quality wireless headphones")
                .build();

        Product product2 = Product.builder()
                .sku("P002")
                .name("Smartwatch")
                .category("Electronics")
                .unitCost(BigDecimal.valueOf(80))
                .unitPrice(BigDecimal.valueOf(150))
                .description("Smartwatch with fitness tracking")
                .build();

        // --- 2. Build ABC items using builder ---
//        AbcItemDto item1 = AbcItemDto.builder()
//                .product(product1)
//                .demandFrequency(BigInteger.valueOf(150))
//                .salesValue(BigDecimal.valueOf(5000))
//                .build();
//
//        AbcItemDto item2 = AbcItemDto.builder()
//                .product(product2)
//                .demandFrequency(BigInteger.valueOf(80))
//                .salesValue(BigDecimal.valueOf(2000))
//                .build();

        AbcItemDto item1 = AbcItemDto.builder()
                .product(product1)
                .demandFrequency(BigInteger.valueOf(50))   // lower than before
                .salesValue(BigDecimal.valueOf(4000))      // moderate sales
                .build();

        AbcItemDto item2 = AbcItemDto.builder()
                .product(product2)
                .demandFrequency(BigInteger.valueOf(200))  // high demand
                .salesValue(BigDecimal.valueOf(3000))      // lower than item1
                .build();

        // --- 3. Build request ------
        AbcRequestPdf request = AbcRequestPdf.builder()
                .mode(mode)
                .items(List.of(item1, item2))
                .shopId("SHOP-123")
                .build();

        String shopName = "My Shop";

        // --- 4. Create payload ---
        AbcPdfPayload payload = new AbcPdfPayload(request, shopName);

        // --- 5. Build report ---
        AbcReport report = reportBuilder.build(payload);

        // --- 6. Generate PDF ---
        byte[] pdfBytes = pdfService.generatePdf(report, "pdf/abc-report");

        // --- 7. Save locally ---
        Files.write(Paths.get("target/" + fileName), pdfBytes);

        System.out.println("PDF generated at target/" + fileName + " for mode: " + mode.getName());
    }




}
