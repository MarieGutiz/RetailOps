package com.retailops.inventorysimulator.simulator.service;


import com.retailops.inventorysimulator.exception.ProductNotFoundException;
import com.retailops.inventorysimulator.model.Product;
import com.retailops.inventorysimulator.model.SimulationRun;
import com.retailops.inventorysimulator.service.ProductService;
import com.retailops.inventorysimulator.service.SimulationServiceModel;
import com.retailops.inventorysimulator.simulator.dto.ProfitRequest;
import com.retailops.inventorysimulator.simulator.dto.ProfitResponse;
import com.retailops.inventorysimulator.simulator.dto.SimulationRunDTO;
import com.retailops.inventorysimulator.util.SimulationType;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class SimulationProfitService {
    final ProductService productService;
    final SimulationServiceModel simulationServiceModel;

    //check calculation of profit
    public ProfitResponse calculateProfit(ProfitRequest request) {

        Product product = productService.getProduct(request.productId())
                .orElseThrow(() -> new ProductNotFoundException(request.productId()));

        int stock = request.stockQtyOrDefault();
        int demand = request.demandOrDefault();
        int sales = Math.min(stock, demand);

        double revenue = sales * product.getUnitPrice();
        double cost = stock * product.getUnitCost();
        double profit = Math.round((revenue - cost) * 100.0) / 100.0; // round to 2 decimals

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
