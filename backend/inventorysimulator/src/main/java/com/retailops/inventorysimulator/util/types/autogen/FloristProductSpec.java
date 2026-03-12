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
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Arrays;

/**
 * Defines the core specification for each florist product used in the inventory
 * and demand simulation model.
 *
 * <p>Each enum constant represents a product with its business characteristics,
 * including category classification, demand distribution parameters, purchase
 * cost range, and retail markup.</p>
 *
 * <p>The specification supports demand modeling (Normal or Uniform), pricing
 * simulation, and inventory policy calculations by providing:</p>
 * <ul>
 *   <li>Product identity and category</li>
 *   <li>Demand parameters (mean/std for Normal or min/max for Uniform)</li>
 *   <li>Supplier cost range</li>
 *   <li>Retail markup factor</li>
 * </ul>
 *
 * <p>This enum acts as the central product configuration for the florist
 * inventory simulation domain.</p>
 */
@Getter
@AllArgsConstructor
public enum FloristProductSpec {

    /* =========================
       A ITEMS – HIGH VALUE
       ========================= */

    ORCHIDS(
            "Orchids",
            FloristCategoryType.FRESH_FLOWERS,
            DemandModel.NORMAL,
            1200, 300,
            7.0, 12.0,
            1.3
    ),

    PROTEAS(
            "Proteas",
            FloristCategoryType.FRESH_FLOWERS,
            DemandModel.NORMAL,
            1000, 250,
            8.0, 14.0,
            1.3
    ),

    ROSES(
            "Roses",
            FloristCategoryType.FRESH_FLOWERS,
            DemandModel.NORMAL,
            8000, 1500,
            1.5, 3.0,
            1.2
    ),

    TULIPS(
            "Tulips",
            FloristCategoryType.FRESH_FLOWERS,
            DemandModel.NORMAL,
            6000, 1200,
            1.2, 2.5,
            1.2
    ),

    PREMIUM_VASE(
            "Premium Vase",
            FloristCategoryType.DECORATIVE_CONTAINERS,
            DemandModel.NORMAL,
            400, 120,
            18.0, 30.0,
            1.3
    ),

    STANDARD_VASE(
            "Standard Vase",
            FloristCategoryType.DECORATIVE_CONTAINERS,
            DemandModel.NORMAL,
            2000, 500,
            3.0, 6.0,
            1.2
    ),

    /* =========================
       C ITEMS – LOW VALUE
       ========================= */

    FLORAL_FOAM(
            "Floral Foam",
            FloristCategoryType.FLORAL_SUPPLIES,
            DemandModel.UNIFORM,
            8000, 15000,
            0.4, 1.0,
            1.1
    ),

    RIBBON(
            "Ribbon",
            FloristCategoryType.FLORAL_SUPPLIES,
            DemandModel.UNIFORM,
            12000, 20000,
            0.1, 0.4,
            1.1
    ),

    FLOWER_FOOD(
            "Flower Food",
            FloristCategoryType.PLANT_CARE_PRODUCTS,
            DemandModel.UNIFORM,
            15000, 25000,
            0.05, 0.15,
            1.1
    );

    /* =========================
       FIELDS
       ========================= */

    private final String name;
    private final FloristCategoryType category;
    private final DemandModel demandModel;

    private final int demandMeanOrMin;
    private final int demandStdOrMax;

    private final double minCost;
    private final double maxCost;
    private final double markup;

    public static FloristProductSpec fromName(
            @NotBlank(message = "Product name is required") String name) {

        return Arrays.stream(values())
                .filter(spec -> spec.name.equalsIgnoreCase(name.trim()))
                .findFirst()
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Unknown FloristProductSpec name: " + name
                        )
                );

    }
}
