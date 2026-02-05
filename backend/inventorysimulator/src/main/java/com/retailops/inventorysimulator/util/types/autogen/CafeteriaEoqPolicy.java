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

package com.retailops.inventorysimulator.util.types.autogen;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;

@Getter
@RequiredArgsConstructor
public enum CafeteriaEoqPolicy {

    COFFEE_BEANS(
            CafeteriaProductSpec.COFFEE_BEANS,
            3600, 300,          // demand mean & std dev
            16.0, 22.0,         // unit cost range
            40.0, 60.0,         // setup cost range
            0.25                // holding rate
    ),

    MILK(
            CafeteriaProductSpec.MILK,
            18000, 1500,
            0.7, 1.1,
            20.0, 30.0,
            0.30
    ),

    CUPS(
            CafeteriaProductSpec.CUPS,
            50000, 3000,
            0.04, 0.08,
            15.0, 25.0,
            0.15
    ),

    SUGAR(
            CafeteriaProductSpec.SUGAR,
            2000, 200,
            0.6, 0.9,
            25.0, 35.0,
            0.20
    );

    private final CafeteriaProductSpec product;

    private final int meanDemand;
    private final int stdDevDemand;

    private final double minUnitCost;
    private final double maxUnitCost;

    private final double minOrderCost;
    private final double maxOrderCost;

    private final double holdingRate;

    public static CafeteriaEoqPolicy forProduct(CafeteriaProductSpec spec) {
        return Arrays.stream(values())
                .filter(p -> p.product == spec)
                .findFirst()
                .orElseThrow(() ->
                        new IllegalStateException(
                                "No EOQ policy for " + spec.name()
                        )
                );
    }
}

