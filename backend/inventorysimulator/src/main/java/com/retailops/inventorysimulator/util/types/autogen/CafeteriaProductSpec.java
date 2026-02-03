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

public enum CafeteriaProductSpec {

    COFFEE_BEANS(
            "Coffee Beans",
            CafeteriaCategoryType.BEVERAGES,
            16, 22,
            1.4
    ),

    MILK(
            "Milk",
            CafeteriaCategoryType.DAIRY,
            0.7, 1.1,
            1.3
    ),

    CUPS(
            "Cups",
            CafeteriaCategoryType.CONSUMABLES,
            0.04, 0.08,
            1.2
    ),

    SUGAR(
            "Sugar",
            CafeteriaCategoryType.INGREDIENTS,
            0.6, 0.9,
            1.2
    );

    public final String name;
    public final CafeteriaCategoryType category;
    public final double minUnitCost;
    public final double maxUnitCost;
    public final double markup;

    CafeteriaProductSpec(
            String name,
            CafeteriaCategoryType category,
            double minUnitCost,
            double maxUnitCost,
            double markup
    ) {
        this.name = name;
        this.category = category;
        this.minUnitCost = minUnitCost;
        this.maxUnitCost = maxUnitCost;
        this.markup = markup;
    }
}
