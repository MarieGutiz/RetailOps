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

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public abstract  class BaseReport {

    private String model;          // e.g., "newsvendor"
    private String shopId;
    private LocalDateTime generatedAt;

    private ReportHeader header;
    private List<Kpi> kpis;
    private List<ReportSection> sections;

    @Data
    public static class ReportHeader {
        private String title;
        private String subtitle;
        private String context;
    }

    @Data
    public static class Kpi {
        private String label;
        private String value;
        private String hint;
        private Severity severity;

        public enum Severity {
            POSITIVE,
            WARNING,
            CRITICAL,
            NEUTRAL
        }
    }

    @Data
    public static class ReportSection {
        private String title;
        private SectionType type;
        private Object payload;

        public enum SectionType {
            TABLE,
            CHART,
            TEXT
        }
    }

}
