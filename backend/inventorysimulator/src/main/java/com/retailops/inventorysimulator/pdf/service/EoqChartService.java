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

import org.springframework.stereotype.Service;

import static com.retailops.inventorysimulator.util.pdf.SvgUtils.svgToBase64Png;


/**
 * Service for generating EOQ cost curve charts, either as SVG or Base64-encoded PNG,
 * illustrating ordering cost, holding cost, total cost, and optimal order quantity (Q*).
 */
@Service
public class EoqChartService {

    private static final int PDF_PAGE_WIDTH = 550;
    private static final int PDF_PAGE_HEIGHT = 300;

    public String generateCostCurveBase64Png(
            double annualDemand,
            double orderingCost,
            double holdingCost,
            double optimalQuantity
    ) throws Exception {

        String svg = generateCostCurveSvg(
                annualDemand,
                orderingCost,
                holdingCost,
                PDF_PAGE_WIDTH,
                PDF_PAGE_HEIGHT
        );

        return svgToBase64Png(svg, PDF_PAGE_WIDTH, PDF_PAGE_HEIGHT);
    }

    public String generateCostCurveSvg(
            double D,
            double S,
            double H,
            int width,
            int height
    ) {
        int padding = 50;
        int points = 500; // higher resolution

        // --- Calculate EOQ internally ---
        double qStar = Math.sqrt(2 * D * S / H);

        // --- Determine X-axis range ---
        double minQ = qStar * 0.2;
        double maxQ = qStar * 2.5;

        // --- Pre-calc max total cost for scaling ---
        double maxCost = 0;
        for (int i = 0; i <= points; i++) {
            double Q = minQ + i * (maxQ - minQ) / points;
            double total = (D / Q) * S + (Q / 2) * H;
            maxCost = Math.max(maxCost, total);
        }

        StringBuilder orderingPath = new StringBuilder();
        StringBuilder holdingPath = new StringBuilder();
        StringBuilder totalPath = new StringBuilder();

        for (int i = 0; i <= points; i++) {
            double Q = minQ + i * (maxQ - minQ) / points;

            double ordering = (D / Q) * S;
            double holding = (Q / 2) * H;
            double total = ordering + holding;

            double scaledX = padding + (Q - minQ) / (maxQ - minQ) * (width - 2 * padding);
            double scaledOrderingY = height - padding - (ordering / maxCost) * (height - 2 * padding);
            double scaledHoldingY = height - padding - (holding / maxCost) * (height - 2 * padding);
            double scaledTotalY = height - padding - (total / maxCost) * (height - 2 * padding);

            if (i == 0) {
                orderingPath.append("M ").append(scaledX).append(" ").append(scaledOrderingY);
                holdingPath.append("M ").append(scaledX).append(" ").append(scaledHoldingY);
                totalPath.append("M ").append(scaledX).append(" ").append(scaledTotalY);
            } else {
                orderingPath.append(" L ").append(scaledX).append(" ").append(scaledOrderingY);
                holdingPath.append(" L ").append(scaledX).append(" ").append(scaledHoldingY);
                totalPath.append(" L ").append(scaledX).append(" ").append(scaledTotalY);
            }
        }

        double qStarX = padding + (qStar - minQ) / (maxQ - minQ) * (width - 2 * padding);

        double legendX = width - 200;
        double legendY = padding;

        String legend = """
                <rect x="%f" y="%f" width="170" height="75"
                      fill="white" stroke="#ccc" stroke-width="1"/>
            
                <line x1="%f" y1="%f" x2="%f" y2="%f"
                      stroke="#2563eb" stroke-width="2"/>
                <text x="%f" y="%f" font-size="11" fill="#333">Ordering Cost</text>
            
                <line x1="%f" y1="%f" x2="%f" y2="%f"
                      stroke="#16a34a" stroke-width="2"/>
                <text x="%f" y="%f" font-size="11" fill="#333">Holding Cost</text>
            
                <line x1="%f" y1="%f" x2="%f" y2="%f"
                      stroke="#dc2626" stroke-width="3"/>
                <text x="%f" y="%f" font-size="11" fill="#333">Total Cost</text>
            
                <line x1="%f" y1="%f" x2="%f" y2="%f"
                      stroke="#f59e0b" stroke-width="2"
                      stroke-dasharray="5,5"/>
                <text x="%f" y="%f" font-size="11" fill="#333">Q* (Optimal Quantity)</text>
            """.formatted(
                legendX, legendY,

                legendX + 10, legendY + 15,
                legendX + 30, legendY + 15,
                legendX + 35, legendY + 19,

                legendX + 10, legendY + 30,
                legendX + 30, legendY + 30,
                legendX + 35, legendY + 34,

                legendX + 10, legendY + 45,
                legendX + 30, legendY + 45,
                legendX + 35, legendY + 49,

                legendX + 10, legendY + 60,
                legendX + 30, legendY + 60,
                legendX + 35, legendY + 64
        );


        return """
        <svg width="%d" height="%d" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%%" height="100%%" fill="white"/>
            
            <path d="%s" fill="none" stroke="#2563eb" stroke-width="2"/>
            <path d="%s" fill="none" stroke="#16a34a" stroke-width="2"/>
            <path d="%s" fill="none" stroke="#dc2626" stroke-width="3"/>
        
            <line x1="%f" y1="%d" x2="%f" y2="%d"
                  stroke="#f59e0b"
                  stroke-width="2"
                  stroke-dasharray="5,5"/>
        
            <text x="%f" y="%d" font-size="12" fill="#333">Q*</text>
        
            %s
        </svg>
        """.formatted(
                width,
                height,
                orderingPath,
                holdingPath,
                totalPath,
                qStarX, padding,
                qStarX, height - padding,
                qStarX + 5, padding + 15,
                legend
        );
    }
}
