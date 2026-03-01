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
import com.retailops.inventorysimulator.simulator.dto.NewsvendorResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportPDFController {

    private final NewsvendorReportBuilder reportBuilder;
    private final ReportPDFService pdfService;

    @PostMapping("/newsvendor/pdf")
    public ResponseEntity<byte[]> pdfNewsvendor(
            @Valid @RequestBody NewsvendorRequestPdf request,
            @Valid @RequestBody NewsvendorResponse response
            ) {

       // 1 Build report from request & Generate PDF bytes
        byte[] pdfBytes = pdfService.generatePdf(request, response);

        // 3 Prepare headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(
                ContentDisposition.attachment()
                        .filename("newsvendor-report.pdf")
                        .build()
        );

        // 4 Return file response
        return ResponseEntity
                .ok()
                .headers(headers)
                .body(pdfBytes);
    }

}
