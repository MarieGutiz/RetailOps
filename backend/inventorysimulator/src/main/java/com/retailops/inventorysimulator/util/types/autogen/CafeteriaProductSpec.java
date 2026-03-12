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

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;

/**
 * Defines cafeteria products with attributes for simulation and inventory modeling.
 *
 * <p>Each product specifies:
 * <ul>
 *     <li>Name and category ({@link CafeteriaCategoryType})</li>
 *     <li>Demand model ({@link DemandModel})</li>
 *     <li>Demand parameters: mean & std deviation or min & max</li>
 *     <li>Cost range (min & max) and markup factor</li>
 * </ul>
 *
 * <p>Products are grouped by ABC classification (A: core revenue, B: supporting, C: low value)
 * and can be retrieved by name using {@link #fromName(String)}.</p>
 */
@RequiredArgsConstructor
@Getter
public enum CafeteriaProductSpec {

    /* =========================
       A ITEMS – CORE REVENUE
       ========================= */

    COFFEE_BEANS(
            "Coffee Beans",
            CafeteriaCategoryType.BEVERAGES,
            DemandModel.NORMAL,
            900, 180,
            16.0, 22.0,
            1.4
    ),

    MILK(
            "Milk",
            CafeteriaCategoryType.DAIRY,
            DemandModel.NORMAL,
            1200, 250,
            0.7, 1.1,
            1.3
    ),

    /* =========================
       B ITEMS – SUPPORTING
       ========================= */

    SUGAR(
            "Sugar",
            CafeteriaCategoryType.INGREDIENTS,
            DemandModel.UNIFORM,
            2000, 3500,
            0.6, 0.9,
            1.2
    ),

    /* =========================
       C ITEMS – LOW VALUE
       ========================= */

    CUPS(
            "Cups",
            CafeteriaCategoryType.CONSUMABLES,
            DemandModel.UNIFORM,
            6000, 10000,
            0.04, 0.08,
            1.2
    );

    /* =========================
       FIELDS
       ========================= */

    private final String name;
    private final CafeteriaCategoryType category;
    private final DemandModel demandModel;

    private final int demandMeanOrMin;
    private final int demandStdOrMax;

    private final double minCost;
    private final double maxCost;
    private final double markup;

    /* =========================
       FACTORY
       ========================= */

    public static CafeteriaProductSpec fromName(
            @NotBlank(message = "Product name is required") String name) {

        return Arrays.stream(values())
                .filter(spec -> spec.name.equalsIgnoreCase(name.trim()))
                .findFirst()
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Unknown CafeteriaProductSpec name: " + name
                        )
                );
    }

}
