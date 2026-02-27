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

import com.retailops.inventorysimulator.simulator.dto.ProfitRequest;
import com.retailops.inventorysimulator.simulator.dto.ProfitResponse;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.math.RoundingMode;

@Service
public class ProfitService {

    public ProfitResponse calculateProfit(ProfitRequest request) {
        BigInteger stock = request.stockQtyOrDefault();
        BigInteger demand = request.demandOrDefault();
        BigInteger sales = stock.min(demand);

        // Revenue = sales * unitPrice
        BigDecimal revenue = request.price().multiply(new BigDecimal(sales));

        // Cost = stock * unitCost
        BigDecimal cost = request.cost().multiply(new BigDecimal(stock));

        // Profit = revenue - cost, rounded to 2 decimals
        BigDecimal profit = revenue.subtract(cost).setScale(2, RoundingMode.HALF_UP);

        return new ProfitResponse(
                request.productName(),
                stock,
                demand,
                profit
        );
    }

}
