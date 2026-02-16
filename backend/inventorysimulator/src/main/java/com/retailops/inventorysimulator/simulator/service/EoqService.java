package com.retailops.inventorysimulator.simulator.service;

import com.retailops.inventorysimulator.exception.ProductNameNotFoundException;
import com.retailops.inventorysimulator.exception.ProductNotFoundException;
import com.retailops.inventorysimulator.model.Product;
import com.retailops.inventorysimulator.model.SimulationRun;
import com.retailops.inventorysimulator.service.ProductService;
import com.retailops.inventorysimulator.service.SimulationServiceModel;
import com.retailops.inventorysimulator.simulator.dto.EoqCurvePointDto;
import com.retailops.inventorysimulator.simulator.dto.EoqCurveResponseDto;
import com.retailops.inventorysimulator.simulator.dto.EoqRequestDto;
import com.retailops.inventorysimulator.simulator.dto.EoqResponseDto;
import com.retailops.inventorysimulator.simulator.generator.dto.EoqMonteCarloSample;
import com.retailops.inventorysimulator.util.types.SimulationType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

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

        Product product = productService.findByName(request.productName())
                .orElseThrow(() -> new ProductNameNotFoundException(request.productName()));

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

    public EoqCurveResponseDto generateCostCurve(
            BigInteger demand,
            BigDecimal setupCost,
            BigDecimal holdingCost
    ) {

        BigDecimal demandDecimal = new BigDecimal(demand);
        BigDecimal two = BigDecimal.valueOf(2);

        // 1 Calculate EOQ
        BigDecimal optimalQ = calculateEOQ(demand, setupCost, holdingCost);

        // 2 Auto-generate intelligent plotting range (CHECK)
        BigDecimal minQ = optimalQ.multiply(BigDecimal.valueOf(0.2));
        BigDecimal maxQ = optimalQ.multiply(BigDecimal.valueOf(2));
        BigDecimal step = optimalQ.divide(BigDecimal.valueOf(20), 2, RoundingMode.HALF_UP);

        List<EoqCurvePointDto> curve = new ArrayList<>();

        BigDecimal q = minQ;

        while (q.compareTo(maxQ) <= 0) {

            BigDecimal orderingCost = demandDecimal
                    .divide(q, 10, RoundingMode.HALF_UP)
                    .multiply(setupCost);

            BigDecimal holdingCostComponent = q
                    .divide(two, 10, RoundingMode.HALF_UP)
                    .multiply(holdingCost);

            BigDecimal totalCost = orderingCost.add(holdingCostComponent);

            curve.add(
                    new EoqCurvePointDto(
                            q,
                            orderingCost,
                            holdingCostComponent,
                            totalCost
                    )
            );

            q = q.add(step);
        }

        return new EoqCurveResponseDto(optimalQ, curve);
    }



}
