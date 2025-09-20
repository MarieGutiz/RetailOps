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
import java.math.BigInteger;
import java.math.RoundingMode;
import java.time.LocalDateTime;

import static com.retailops.inventorysimulator.simulator.CriticalRatioCalculator.calculateCriticalRatio;

/**
 * Service class for managing the News Vendor(behind the idea).
 *
 * where:
 * Cr= Critical Ratio
 * Cs = Cost of shortage
 * Ce = Cost of excess
 * g = salvage value, given by the ability to re-sale in case there are left overs
 *
 *
 *
 * Cs = price - cost
 * Ce = cost - g
 * Cr = Cs /(Cs + Ce)
 *
 *
 *
 */
@Service
@RequiredArgsConstructor
public class NewsVendorSimulatorService {
    final ProductService productService;
    final SimulationServiceModel simulationServiceModel;

    public NewsVendorResponse simulate(NewsVendorRequest request) {
        Product product = productService.getProduct(request.productId())
                .orElseThrow(() -> new ProductNotFoundException(request.productId()));

        BigDecimal criticalRatio = calculateCriticalRatio(product);

        // For now: Optimal order quantity = mean demand rounded
        int Qstar = request.meanDemand().setScale(0, RoundingMode.HALF_UP).intValue();

        if (request.saveToHistory()) {
            SimulationRun sim = SimulationRun.builder()
                    .productName(product.getName())
                    .simulationType(SimulationType.NEWSVENDOR)
                    .stockQty(BigInteger.valueOf(Qstar))
                    .demand(request.meanDemand().toBigIntegerExact())
                    .profit(null) // not relevant here
                    .runAt(LocalDateTime.now())
                    .username(request.usernameOrDefault())
                    .build();
            simulationServiceModel.save(sim);
        }

        return new NewsVendorResponse(
                product.getName(),
                criticalRatio,
                BigInteger.valueOf(Qstar)
        );
    }

}
