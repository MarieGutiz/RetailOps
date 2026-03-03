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

import lombok.AllArgsConstructor;
import lombok.Data;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;

@Data
public abstract  class BaseReport {

    private String model;          // e.g., "newsvendor"
    private String shopId;
    private LocalDateTime generatedAt;

    private ReportHeader header;
    private List<Kpi> kpis;
    private List<ReportSection> sections;

    // --- Reusable fields ---
    private String watermarkBase64;  // Base64 PNG for PDF/HTML watermark
    private String githubLink;       //  "https://github.com/mariegutiz"

    // --- DEFAULT SETUP METHOD ---
    public void setupDefaults() {
        try {
            this.watermarkBase64 = generateHeaderWatermarkBase64();
        } catch (IOException e) {
            e.printStackTrace();
            this.watermarkBase64 = null;
        }
        this.githubLink = "https://github.com/mariegutiz";
    }

    /**
     * Generate a Base64 PNG for the header watermark:
     * - 50px high logo + "RetailOps Sim" text
     */
    private String generateHeaderWatermarkBase64() throws IOException {
        try (InputStream is = getClass().getResourceAsStream("/templates/pdf/retailops.png")) {
            if (is == null) throw new IOException("Logo not found in classpath");

            BufferedImage logo = ImageIO.read(is);

            int logoHeight = 50;
            int logoWidth = (int) ((double) logo.getWidth() / logo.getHeight() * logoHeight);

            BufferedImage headerImage = new BufferedImage(logoWidth + 150, logoHeight, BufferedImage.TYPE_INT_ARGB);
            Graphics2D g = headerImage.createGraphics();

            g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            g.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);

            g.drawImage(logo, 0, 0, logoWidth, logoHeight, null);

            g.setFont(new Font("Arial", Font.BOLD, 20));
            g.setColor(new Color(44, 123, 229)); // brand color #2C7BE5
            g.drawString("RetailOps Sim", logoWidth + 10, logoHeight - 10);

            g.dispose();

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(headerImage, "png", baos);
            return Base64.getEncoder().encodeToString(baos.toByteArray());
        }
    }

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
    public static class ReportParameter {
        private String label;
        private String value;
        private boolean isCurrency;

        public ReportParameter(String label, String value) {
            this(label, value, false);
        }

        public ReportParameter(String label, String value, boolean isCurrency) {
            this.label = label;
            this.value = value;
            this.isCurrency = isCurrency;
        }
    }

    @Data
    public static class ReportSection {
        private String title;
        private SectionType type;
        private Object payload; // can be List<ReportParameter>, List<Map<String,Object>>, String (text), or Chart object

        public enum SectionType {
            PARAMETERS,
            TABLE,
            CHART,
            TEXT
        }
    }

}
