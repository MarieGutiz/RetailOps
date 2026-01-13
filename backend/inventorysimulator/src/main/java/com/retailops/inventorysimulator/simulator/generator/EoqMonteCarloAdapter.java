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

package com.retailops.inventorysimulator.simulator.generator;

import com.retailops.inventorysimulator.model.Product;
import com.retailops.inventorysimulator.service.ProductService;
import com.retailops.inventorysimulator.simulator.dto.EoqRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EoqMonteCarloAdapter {

    private final ProductService productService;

    public EoqRequestDto adapt(
            EoqMonteCarloSample sample,
            String username,
            boolean saveToHistory) {

        Product product = productService
                .findByName(sample.productLabel())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Product not found: " + sample.productLabel()
                        )
                );

        return new EoqRequestDto(
                product.getId(),
                sample.demand(),
                sample.setupCost(),
                sample.holdingCost(),
                saveToHistory,
                username
        );
    }
}
