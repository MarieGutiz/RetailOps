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

package com.retailops.inventorysimulator.pdf.model;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

public abstract class AbstractReportBuilder<
        R extends BaseReport,
        C> {

    public R build(C context) {

        R report = createReport();

        report.setupDefaults();
        report.setModel(getModelName());
        report.setShopId(extractShopId(context));
        report.setGeneratedAt(LocalDateTime.now());

        report.setHeader(buildHeader(context));
        report.setKpis(buildKpis(context));
        report.setSections(buildSections(context));

        applyModelSpecificFields(report, context);

        return report;
    }

    protected abstract R createReport();

    protected abstract String getModelName();

    protected abstract String extractShopId(C context);

    protected abstract BaseReport.ReportHeader buildHeader(C context);

    protected abstract List<BaseReport.Kpi> buildKpis(C context);

    protected abstract List<BaseReport.ReportSection> buildSections(C context);

    protected void applyModelSpecificFields(R report, C context) {
        // default: do nothing
    }

    protected String formatNow() {
        return formatDateTime(LocalDateTime.now());
    }

    protected String formatDateTime(LocalDateTime dateTime) {
        DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern("MMM d, yyyy, h:mm a", Locale.ENGLISH);
        return dateTime.format(formatter);
    }
}
