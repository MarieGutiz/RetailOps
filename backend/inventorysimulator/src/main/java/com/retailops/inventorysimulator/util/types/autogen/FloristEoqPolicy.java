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

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Arrays;

/**
 * Defines the EOQ (Economic Order Quantity) policy parameters for each florist product type.
 * <p>
 * Each enum constant maps a {@link FloristProductSpec} to inventory control parameters used
 * in EOQ calculations, including:
 * <ul>
 *   <li>Minimum and maximum ordering (setup) cost range</li>
 *   <li>Annual holding cost rate</li>
 * </ul>
 * These parameters allow the system to determine optimal replenishment quantities
 * and inventory costs for different categories of florist supplies.
 */
@Getter
@AllArgsConstructor
public enum FloristEoqPolicy {

    ORCHIDS(
            FloristProductSpec.ORCHIDS,
            15.0, 30.0,     // setup cost range
            0.55            // holding rate
    ),

    ROSES(
            FloristProductSpec.ROSES,
            15.0, 30.0,
            0.55
    ),

    PREMIUM_VASE(
            FloristProductSpec.PREMIUM_VASE,
            40.0, 70.0,
            0.18
    ),

    FLORAL_FOAM(
            FloristProductSpec.FLORAL_FOAM,
            20.0, 35.0,
            0.30
    ),

    PROTEAS(
            FloristProductSpec.PROTEAS,
            15.0, 30.0,
            0.55
    ),

    TULIPS(
            FloristProductSpec.TULIPS,
            15.0, 30.0,
            0.55
    ),

    STANDARD_VASE(
            FloristProductSpec.STANDARD_VASE,
            25.0, 45.0,
            0.20
    ),

    RIBBON(
            FloristProductSpec.RIBBON,
            10.0, 20.0,
            0.25
    ),

    FLOWER_FOOD(
            FloristProductSpec.FLOWER_FOOD,
            8.0, 18.0,
            0.20
    )
    ;

    private final FloristProductSpec product;
    private final double minOrderCost;
    private final double maxOrderCost;
    private final double holdingRate;

    public static FloristEoqPolicy forProduct(FloristProductSpec spec) {
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
