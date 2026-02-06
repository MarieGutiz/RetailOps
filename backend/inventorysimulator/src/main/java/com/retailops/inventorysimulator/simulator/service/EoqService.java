package com.retailops.inventorysimulator.simulator.service;

import com.retailops.inventorysimulator.exception.ProductNotFoundException;
import com.retailops.inventorysimulator.model.Product;
import com.retailops.inventorysimulator.model.SimulationRun;
import com.retailops.inventorysimulator.service.ProductService;
import com.retailops.inventorysimulator.service.SimulationServiceModel;
import com.retailops.inventorysimulator.simulator.dto.EoqRequestDto;
import com.retailops.inventorysimulator.simulator.dto.EoqResponseDto;
import com.retailops.inventorysimulator.simulator.generator.dto.EoqMonteCarloSample;
import com.retailops.inventorysimulator.util.types.SimulationType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDateTime;

import static com.retailops.inventorysimulator.util.calculator.EoqCalculator.calculateEOQ;

@Service
@RequiredArgsConstructor
public class EoqService {
    private final SimulationServiceModel simulationServiceModel;
    private final ProductService productService;

    // =========================
    // Public API (requests)
    // =========================

    public EoqResponseDto runEoq(EoqRequestDto request) {

        Product product = productService.getProduct(request.productId())
                .orElseThrow(() -> new ProductNotFoundException(request.productId()));

        EoqResponseDto response = calculateCommon(
                product.getName(),
                request.demand(),
                request.cost(),
                request.holdingCost()
        );

        if (request.saveToHistory()) {
            saveToHistory(
                    product.getName(),
                    request,
                    response.eoq()
            );
        }

        return response;
    }


    public EoqResponseDto calculate(EoqMonteCarloSample sample) {

        return calculateCommon(
                sample.productLabel(),
                sample.demand(),
                sample.setupCost(),
                sample.holdingCost()
        );
    }

    // =========================
    // Common calculation core
    // =========================

    private EoqResponseDto calculateCommon(
            String productName,
            BigInteger demand,
            BigDecimal setupCost,
            BigDecimal holdingCost
    ) {

        BigDecimal eoq = calculateEOQ(demand, setupCost, holdingCost);

        return new EoqResponseDto(
                productName,
                demand,
                setupCost,
                holdingCost,
                eoq
        );
    }

    // =========================
    // History persistence
    // =========================

    private void saveToHistory(
            String productName,
            EoqRequestDto request,
            BigDecimal eoq
    ) {

        SimulationRun run = new SimulationRun();
        run.setSimulationType(SimulationType.EOQ);
        run.setProductName(productName);
        run.setDemand(request.demand());
        run.setSetupCost(request.cost());
        run.setHoldingCost(request.holdingCost());
        run.setEoq(eoq);
        run.setUsername(request.username());
        run.setRunAt(LocalDateTime.now());

        simulationServiceModel.save(run);
    }

}
