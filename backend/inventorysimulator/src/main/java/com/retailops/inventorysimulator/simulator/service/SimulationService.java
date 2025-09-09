package com.retailops.inventorysimulator.simulator.service;


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
import java.util.List;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
public class SimulationService {
    final ProductService productService;
    final SimulationServiceModel simulationServiceModel;

    //check calculation of profit
    public ProfitResponse calculateProfit(ProfitRequest request) {
        Product product = productService.get(request.getProductId());
        int sales = Math.min(request.getStockQty(), request.getDemand());
        double revenue = sales * product.getUnitPrice();
        double cost = request.getStockQty() * product.getUnitCost();
        double profit = revenue - cost;

        if(request.isSaveToHistory()){
            SimulationRun sim = SimulationRun.builder()
                    .productName(product.getName())
                    .simulationType(SimulationType.PROFIT)
                    .stockQty(request.getStockQty())
                    .demand(request.getDemand())
                    .profit(profit)
                    .runAt(LocalDateTime.now())
                    .username(request.getUsername() != null ? request.getUsername() : "guess")
                    .build();
            simulationServiceModel.save(sim);

        }
       return new ProfitResponse(product.getName(),
                                request.getStockQty(),
                                request.getDemand(),
                                profit);
    }


    public Page<SimulationRunDTO> getHistory(String username, int page, int size) {
         return simulationServiceModel.getHistory(username, page, size);
    }


}
