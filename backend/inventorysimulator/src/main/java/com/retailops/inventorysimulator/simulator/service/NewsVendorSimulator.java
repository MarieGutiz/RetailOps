package com.retailops.inventorysimulator.simulator.service;

import com.retailops.inventorysimulator.exception.ProductNotFoundException;
import com.retailops.inventorysimulator.model.Product;
import com.retailops.inventorysimulator.model.SimulationRun;
import com.retailops.inventorysimulator.service.ProductService;
import com.retailops.inventorysimulator.service.SimulationServiceModel;
import com.retailops.inventorysimulator.simulator.dto.NewsVendorRequest;
import com.retailops.inventorysimulator.simulator.dto.NewsVendorResponse;
import com.retailops.inventorysimulator.util.SimulationType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class NewsVendorSimulator {
    final ProductService productService;
    final SimulationServiceModel simulationServiceModel;

    public NewsVendorResponse simulate(NewsVendorRequest request) {
        Product product = productService.getProduct(request.productId())
                .orElseThrow(() -> new ProductNotFoundException(request.productId()));

        // Costs
        BigDecimal unitPrice = BigDecimal.valueOf(product.getUnitPrice());
        BigDecimal unitCost = BigDecimal.valueOf(product.getUnitCost());

        BigDecimal Cu = unitPrice.subtract(unitCost); // underage cost
        BigDecimal Co = unitCost;                     // overage cost

        BigDecimal criticalRatio = Cu.divide(Cu.add(Co), 4, RoundingMode.HALF_UP);

        // For now: Optimal order quantity = mean demand rounded
        int Qstar = request.meanDemand().setScale(0, RoundingMode.HALF_UP).intValue();

        if (request.saveToHistory()) {
            SimulationRun sim = SimulationRun.builder()
                    .productName(product.getName())
                    .simulationType(SimulationType.NEWSVENDOR)
                    .stockQty(Qstar)
                    .demand(request.meanDemand().intValue())
                    .profit(null) // not relevant here
                    .runAt(LocalDateTime.now())
                    .username(request.usernameOrDefault())
                    .build();
            simulationServiceModel.save(sim);
        }

        return new NewsVendorResponse(
                product.getName(),
                criticalRatio,
                Qstar
        );
    }

}
