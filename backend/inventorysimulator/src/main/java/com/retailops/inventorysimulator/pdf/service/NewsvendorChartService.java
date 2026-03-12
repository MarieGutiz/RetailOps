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

import com.retailops.inventorysimulator.util.distribution.Normal;
import org.springframework.stereotype.Service;

import static com.retailops.inventorysimulator.util.pdf.SvgUtils.svgToBase64Png;

/**
 * Service responsible for generating Newsvendor risk distribution charts
 * for reports and PDFs. Provides methods to create SVG visualizations
 * of the demand distribution and service level shading, and convert them
 * to Base64-encoded PNGs suitable for embedding in reports.
 */
@Service
public class NewsvendorChartService {


    /**
     * Generate a Base64 PNG of the risk distribution for embedding in PDFs
     */
    // Typical PDF page width in pixels (A4 ~595px wide at 72dpi)
    private static final int PDF_PAGE_WIDTH = 550;
    private static final int PDF_PAGE_HEIGHT = 300;

    /**
     * Generate a Base64 PNG of the risk distribution scaled for PDF
     */
    public String generateRiskDistributionBase64Png(double mean, double std, double serviceLevel) throws Exception {
        String svg = generateRiskDistributionSvg(mean, std, serviceLevel, PDF_PAGE_WIDTH, PDF_PAGE_HEIGHT);
        return svgToBase64Png(svg, PDF_PAGE_WIDTH, PDF_PAGE_HEIGHT);
    }

    /**
     * Generate SVG for risk distribution scaled for given width/height
     */
    public String generateRiskDistributionSvg(
            double mean,
            double std,
            double serviceLevel,
            int width,
            int height
    ) {

        int padding = 50;
        int points = 250;

        double minX = mean - 4 * std;
        double maxX = mean + 4 * std;

        double maxDensity = Normal.normalPDF(mean, mean, std);

        StringBuilder curvePath = new StringBuilder();
        StringBuilder shadedPath = new StringBuilder();

        double criticalValue = inverseCDF(serviceLevel, mean, std);

        for (int i = 0; i <= points; i++) {
            double x = minX + i * (maxX - minX) / points;
            double y = Normal.normalPDF(x, mean, std);

            double scaledX = padding + (x - minX) / (maxX - minX) * (width - 2 * padding);
            double scaledY = height - padding - (y / maxDensity) * (height - 2 * padding);

            if (i == 0) {
                curvePath.append("M ").append(scaledX).append(" ").append(scaledY);
                shadedPath.append("M ").append(scaledX).append(" ").append(height - padding);
            } else {
                curvePath.append(" L ").append(scaledX).append(" ").append(scaledY);
            }

            if (x <= criticalValue) {
                shadedPath.append(" L ").append(scaledX).append(" ").append(scaledY);
            }
        }

        double criticalX = padding + (criticalValue - minX) / (maxX - minX) * (width - 2 * padding);
        shadedPath.append(" L ").append(criticalX).append(" ").append(height - padding).append(" Z");

        double legendX = width - 200;
        double legendY = padding;

        String legend = """
            <rect x="%f" y="%f" width="180" height="65"
                  fill="white" stroke="#ccc" stroke-width="1"/>
        
            <rect x="%f" y="%f" width="20" height="10"
                  fill="#2C7BE5" fill-opacity="0.2"/>
            <text x="%f" y="%f" font-size="11" fill="#333">
                Service Level Area
            </text>
        
            <line x1="%f" y1="%f" x2="%f" y2="%f"
                  stroke="#2C7BE5" stroke-width="2"/>
            <text x="%f" y="%f" font-size="11" fill="#333">
                Demand Distribution
            </text>
        
            <line x1="%f" y1="%f" x2="%f" y2="%f"
                  stroke="#E63757" stroke-width="2"
                  stroke-dasharray="5,5"/>
            <text x="%f" y="%f" font-size="11" fill="#333">
                Optimal Order Quantity (Q*)
            </text>
        """.formatted(
                legendX, legendY,

                legendX + 10, legendY + 12,
                legendX + 35, legendY + 20,

                legendX + 10, legendY + 30,
                legendX + 30, legendY + 30,
                legendX + 35, legendY + 34,

                legendX + 10, legendY + 48,
                legendX + 30, legendY + 48,
                legendX + 35, legendY + 52
        );

        return """
        <svg width="%d" height="%d" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%%" height="100%%" fill="white"/>
            <path d="%s" fill="#2C7BE5" fill-opacity="0.2"/>
            <path d="%s" fill="none" stroke="#2C7BE5" stroke-width="2"/>
            <line x1="%f" y1="%d" x2="%f" y2="%d"
                  stroke="#E63757"
                  stroke-width="2"
                  stroke-dasharray="5,5"/>
            <text x="%f" y="%d" font-size="12" fill="#333">Q*</text>
        
            %s
        </svg>
        """.formatted(
                width,
                height,
                shadedPath,
                curvePath,
                criticalX, padding,
                criticalX, height - padding,
                criticalX + 5, padding + 15,
                legend
        );
    }


    /**
     * Simple binary search inverse CDF using your Normal.normalCDF()
     */
    public double inverseCDF(double p, double mean, double std) {
        double low = mean - 6 * std;
        double high = mean + 6 * std;

        while (high - low > 1e-6) {
            double mid = (low + high) / 2;
            double cdf = Normal.normalCDF(mid, mean, std);

            if (cdf < p) {
                low = mid;
            } else {
                high = mid;
            }
        }
        return (low + high) / 2;
    }

}
