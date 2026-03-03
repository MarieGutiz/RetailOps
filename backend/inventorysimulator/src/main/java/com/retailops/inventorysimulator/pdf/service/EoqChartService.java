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
                optimalQuantity,
                PDF_PAGE_WIDTH,
                PDF_PAGE_HEIGHT
        );

        return svgToBase64Png(svg, PDF_PAGE_WIDTH, PDF_PAGE_HEIGHT);
    }

    public String generateCostCurveSvg(
            double D,
            double S,
            double H,
            double qStar,
            int width,
            int height
    ) {

        int padding = 50;
        int points = 250;

        double minQ = qStar * 0.2;
        double maxQ = qStar * 2.5;

        double maxCost = 0;

        // Pre-calc max cost for scaling
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
        </svg>
        """.formatted(
                width,
                height,
                orderingPath,
                holdingPath,
                totalPath,
                qStarX, padding,
                qStarX, height - padding,
                qStarX + 5, padding + 15
        );
    }
}
