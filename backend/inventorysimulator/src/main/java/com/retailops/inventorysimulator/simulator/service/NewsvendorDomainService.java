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

package com.retailops.inventorysimulator.simulator.service;

import com.retailops.inventorysimulator.exception.ProductNotFoundException;
import com.retailops.inventorysimulator.model.Product;
import com.retailops.inventorysimulator.service.ProductService;
import com.retailops.inventorysimulator.simulator.dto.NewsvendorContext;
import com.retailops.inventorysimulator.simulator.dto.NewsvendorRequest;
import com.retailops.inventorysimulator.util.calculator.CriticalRatioCalculator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class NewsvendorDomainService {

    private final ProductService productService;
    private final CriticalRatioCalculator criticalRatioCalculator;

    public NewsvendorContext prepareContext(NewsvendorRequest request) {

        Product product = productService.getProduct(request.productId())
                .orElseThrow(() -> new ProductNotFoundException(request.productId()));

        BigDecimal price = product.getUnitPrice();
        BigDecimal cost = product.getUnitCost();
        BigDecimal salvage = request.salvageValue();

        BigDecimal criticalRatio =
                criticalRatioCalculator.calculate(price, cost, salvage);

        return new NewsvendorContext(
                product,
                price,
                cost,
                salvage,
                criticalRatio
        );
    }

}
