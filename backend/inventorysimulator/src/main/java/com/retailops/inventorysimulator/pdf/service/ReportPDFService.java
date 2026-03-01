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

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import com.retailops.inventorysimulator.pdf.dto.NewsvendorRequestPdf;
import com.retailops.inventorysimulator.pdf.model.NewsvendorReport;
import com.retailops.inventorysimulator.simulator.dto.NewsvendorResponse;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.ByteArrayOutputStream;


@Service
public class ReportPDFService {

    private final TemplateEngine templateEngine;
    private final NewsvendorReportBuilder reportBuilder;

    public ReportPDFService(TemplateEngine templateEngine, NewsvendorReportBuilder reportBuilder) {
        this.templateEngine = templateEngine;
        this.reportBuilder = reportBuilder;
    }

    public byte[] generatePdf(NewsvendorRequestPdf request, NewsvendorResponse response) {
        NewsvendorReport report = reportBuilder.buildFromRequest(request, response);

        Context context = new Context();
        context.setVariable("report", report);

        String html = templateEngine.process("pdf/newsvendor-report", context);
        System.out.println(html);

        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.withHtmlContent(html, null);
            builder.toStream(outputStream);
            builder.run();//PROBLEM

            return outputStream.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF", e);
        }
    }

}
