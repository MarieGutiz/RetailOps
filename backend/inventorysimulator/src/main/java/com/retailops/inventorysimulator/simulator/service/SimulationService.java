package com.retailops.inventorysimulator.simulator.service;


import com.retailops.inventorysimulator.model.Product;
import com.retailops.inventorysimulator.service.ProductService;
import com.retailops.inventorysimulator.simulator.dto.ProfitRequest;
import com.retailops.inventorysimulator.simulator.dto.ProfitResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SimulationService {
    final ProductService productService;

    //check calculation of profit
    public ProfitResponse calculateProfit(ProfitRequest request) {
        Product product = productService.get(request.getProductId());
        int sales = Math.min(request.getStockQty(), request.getDemand());
        double revenue = sales * product.getUnitPrice();
        double cost = request.getStockQty() * product.getUnitCost();
        double profit = revenue - cost;

       return new ProfitResponse(product.getName(),
                                request.getStockQty(),
                                request.getDemand(),
                                profit);
    }
}
