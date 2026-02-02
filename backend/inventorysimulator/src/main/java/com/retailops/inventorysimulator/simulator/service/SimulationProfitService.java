package com.retailops.inventorysimulator.simulator.service;


import com.retailops.inventorysimulator.exception.ProductNotFoundException;
import com.retailops.inventorysimulator.model.Product;
import com.retailops.inventorysimulator.model.SimulationRun;
import com.retailops.inventorysimulator.service.ProductService;
import com.retailops.inventorysimulator.service.SimulationServiceModel;
import com.retailops.inventorysimulator.simulator.dto.ProfitRequest;
import com.retailops.inventorysimulator.simulator.dto.ProfitResponse;
import com.retailops.inventorysimulator.simulator.dto.SimulationRunDTO;
import com.retailops.inventorysimulator.util.types.SimulationType;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.math.RoundingMode;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class SimulationProfitService {
    final ProductService productService;
    final SimulationServiceModel simulationServiceModel;

    public ProfitResponse calculateProfit(ProfitRequest request) {

        Product product = productService.getProduct(request.productId())
                .orElseThrow(() -> new ProductNotFoundException(request.productId()));

        BigInteger stock = request.stockQtyOrDefault();
        BigInteger demand = request.demandOrDefault();
        BigInteger sales = stock.min(demand); // BigInteger.min

        // Revenue = sales * unitPrice
        BigDecimal revenue = product.getUnitPrice().multiply(new BigDecimal(sales));

        // Cost = stock * unitCost
        BigDecimal cost = product.getUnitCost().multiply(new BigDecimal(stock));

        // Profit = revenue - cost, rounded to 2 decimals
        BigDecimal profit = revenue.subtract(cost).setScale(2, RoundingMode.HALF_UP);

        if (request.saveToHistory()) {
            SimulationRun sim = SimulationRun.builder()
                    .productName(product.getName())
                    .simulationType(SimulationType.PROFIT)
                    .stockQty(stock)
                    .demand(demand)
                    .profit(profit)
                    .runAt(LocalDateTime.now())
                    .username(request.usernameOrDefault())
                    .build();
            simulationServiceModel.save(sim);
        }

        return new ProfitResponse(
                product.getName(),
                stock,
                demand,
                profit
        );
    }



    public Page<SimulationRunDTO> getHistory(String username, int page, int size) {
         return simulationServiceModel.getHistory(username, page, size);
    }


}
