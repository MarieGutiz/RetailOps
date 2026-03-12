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

package com.retailops.inventorysimulator.util.types;

import lombok.Getter;

/**
 * Represents the ABC inventory classification categories.
 *
 * <p>ABC analysis groups products based on their relative value and impact
 * on total inventory cost:</p>
 * <ul>
 *   <li>A – High-value, high-priority items requiring strict control</li>
 *   <li>B – Moderate-value items with balanced monitoring</li>
 *   <li>C – Low-value items typically managed with simpler controls</li>
 * </ul>
 *
 * Each category includes a human-readable label used for reporting
 * and presentation purposes.
 */
@Getter
public enum ABCCategoryType {
    A("Class A"),
    B("Class B"),
    C("Class C");

    private final String name;

    ABCCategoryType(String s) {
        this.name = s;
    }
}
