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

import com.retailops.inventorysimulator.pdf.dto.AbcPdfPayload;
import com.retailops.inventorysimulator.pdf.dto.EoqPdfPayload;
import com.retailops.inventorysimulator.pdf.dto.NewsvendorPdfPayload;
import com.retailops.inventorysimulator.pdf.model.AbcReport;
import com.retailops.inventorysimulator.pdf.model.EoqReport;
import com.retailops.inventorysimulator.pdf.model.NewsvendorReport;
import com.retailops.inventorysimulator.pdf.service.AbcReportBuilder;
import com.retailops.inventorysimulator.pdf.service.EoqReportBuilder;
import com.retailops.inventorysimulator.pdf.service.NewsvendorReportBuilder;

import com.retailops.inventorysimulator.pdf.service.ReportPDFService;

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

/**
 * Controller for generating PDF reports for different simulation types
 * (Newsvendor, EOQ, ABC) and returning them as downloadable responses.
 */
@Controller
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportPDFController {

    private final NewsvendorReportBuilder newsvendorBuilder;
    private final EoqReportBuilder eoqBuilder;
    private final AbcReportBuilder abcBuilder;
    private final ReportPDFService pdfService;

    // -------------------------------
    // NEWSVENDOR
    // -------------------------------
    @PostMapping("/newsvendor/pdf")
    public ResponseEntity<byte[]> pdfNewsvendor(
            @Valid @RequestBody NewsvendorPdfPayload payload) {

        NewsvendorReport report =
                newsvendorBuilder.build(
                        payload);
         System.out.println("newsvendor pdf "+report);
        byte[] pdfBytes = pdfService.generatePdf(
                report,
                "pdf/newsvendor-report"
        );

        return buildPdfResponse(pdfBytes, "newsvendor-report.pdf");
    }

    // -------------------------------
    // EOQ
    // -------------------------------
    @PostMapping("/eoq/pdf")
    public ResponseEntity<byte[]> pdfEoq(
            @Valid @RequestBody EoqPdfPayload payload) {

        EoqReport report =
                eoqBuilder.build(
                        payload
                );

        byte[] pdfBytes = pdfService.generatePdf(
                report,
                "pdf/eoq-report"
        );

        return buildPdfResponse(pdfBytes, "eoq-report.pdf");
    }

    // -------------------------------
    // ABC
    // -------------------------------
    @PostMapping("/abc/pdf")
    public ResponseEntity<byte[]> pdfAbc(
            @Valid @RequestBody AbcPdfPayload payload) {

        AbcReport report =
                abcBuilder.build(
                        payload
                );

        byte[] pdfBytes = pdfService.generatePdf(
                report,
                "pdf/abc-report"
        );

        return buildPdfResponse(pdfBytes, "abc-report.pdf");
    }

    // -------------------------------
    // Common Response Builder
    // -------------------------------
    private ResponseEntity<byte[]> buildPdfResponse(byte[] pdfBytes, String filename) {

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(
                ContentDisposition.attachment()
                        .filename(filename)
                        .build()
        );

        return ResponseEntity
                .ok()
                .headers(headers)
                .body(pdfBytes);
    }


}
