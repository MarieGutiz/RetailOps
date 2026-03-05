package com.retailops.inventorysimulator.simulator.service;

import com.retailops.inventorysimulator.exception.ProductNameNotFoundException;
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
import java.util.List;

import static com.retailops.inventorysimulator.util.calculator.EoqCalculator.calculateEOQ;

/**
 * Service class for managing the Economic Order Quantity (EOQ) model.
 *
 * The EOQ model determines the optimal order quantity Q*
 * that minimizes total annual inventory cost under deterministic demand.
 *
 * Assumptions:
 *  - Constant annual demand (D)
 *  - Constant setup/ordering cost (S)
 *  - Constant holding cost per unit per year (H)
 *  - Instantaneous replenishment
 *  - No shortages allowed
 *
 * Core formula:
 *
 *      Q* = sqrt( (2 * D * S) / H )
 *
 * Where:
 *  D = Annual demand
 *  S = Setup (ordering) cost per order
 *  H = Holding cost per unit per year
 *
 * Total Cost Function:
 *
 *      TC(Q) = (D / Q) * S + (Q / 2) * H
 *
 * This service:
 *  - Computes optimal EOQ
 *  - Derives economic indicators (cost breakdown, cycle time, orders/year)
 *  - Optionally persists simulation history
 *  - Generates cost curves for visualization
 */


@Service
@RequiredArgsConstructor
public class EoqService {
    private final SimulationServiceModel simulationServiceModel;
    private final ProductService productService;

    /**
     * Executes an EOQ calculation.
     *
     * @param request input parameters including demand,
     *                setup cost, and holding cost
     * @return EoqResponseDto containing the calculated EOQ
     *         and related cost metrics
     */
    public EoqResponseDto runEoq(
            EoqRequestDto request,
            String simId,
            String shopName) {
        if(simId ==null && shopName==null)return null;

        EoqResponseDto response = calculateCommon(
                request.productName(),
                request.demand(),
                request.cost(),
                request.holdingCost()
        );

        if (request.saveToHistory()) {
            saveToHistory(
                    request.productName(),
                    request,
                    response.eoq()
            );
        }

        return response;
    }



    /**
     * Performs the core EOQ calculation and derives
     * related inventory metrics.
     *
     * @param productName name of the product
     * @param demand annual demand
     * @param setupCost setup cost per order
     * @param holdingCost holding cost per unit
     * @return EoqResponseDto containing EOQ and cost details
     */
    private EoqResponseDto calculateCommon(
            String productName,
            BigInteger demand,
            BigDecimal setupCost,
            BigDecimal holdingCost
    ) {

        BigDecimal eoq = calculateEOQ(demand, setupCost, holdingCost);

        // Derived metrics
        BigDecimal demandDecimal = new BigDecimal(demand);
        BigDecimal orderingCost = demandDecimal.divide(eoq, 10, RoundingMode.HALF_UP)
                .multiply(setupCost);
        BigDecimal holdingCostTotal = eoq.divide(BigDecimal.valueOf(2), 10, RoundingMode.HALF_UP)
                .multiply(holdingCost);
        BigDecimal totalCost = orderingCost.add(holdingCostTotal);
        BigDecimal numberOfOrders = demandDecimal.divide(eoq, 10, RoundingMode.HALF_UP);
        BigDecimal cycleTime = eoq.divide(demandDecimal, 10, RoundingMode.HALF_UP);

        return new EoqResponseDto(
                productName,
                demand,
                setupCost,
                holdingCost,
                eoq,
                orderingCost,
                holdingCostTotal,
                totalCost,
                numberOfOrders,
                cycleTime
        );

    }

    /**
     * Persists EOQ calculation results.
     *
     * @param productName name of the product
     * @param request original request data
     * @param eoq calculated economic order quantity
     */
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
        run.setAccount(request.account()); // link to registered user or null for guest
        run.setRunAt(LocalDateTime.now());

        simulationServiceModel.save(run);
    }

    /**
     * Generates cost curve data for different order quantities.
     *
     * Calculates ordering cost, holding cost,
     * and total cost for a range of Q values.
     *
     * @param demand annual demand
     * @param setupCost setup cost per order
     * @param holdingCost holding cost per unit
     * @return EoqCurveResponseDto containing optimal EOQ
     *         and cost curve points
     */
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

    /**
     *
     * @param sample EoqMonteCarlo sample dto
     * @return EoqResponseDto containing the calculated EOQ
     *         and related cost metrics

     */
    public EoqResponseDto calculate(EoqMonteCarloSample sample) {

        return calculateCommon(
                sample.productLabel(),
                sample.demand(),
                sample.setupCost(),
                sample.holdingCost()
        );
    }


}
