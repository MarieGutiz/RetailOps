package com.retailops.inventorysimulator.simulator.service;


import com.retailops.inventorysimulator.model.SimulationRun;
import com.retailops.inventorysimulator.service.ProductService;
import com.retailops.inventorysimulator.service.SimulationServiceModel;
import com.retailops.inventorysimulator.simulator.autogenshop.MonteCarloFactory;
import com.retailops.inventorysimulator.simulator.dto.NewsvendorRequest;
import com.retailops.inventorysimulator.simulator.dto.NewsvendorResponse;
import com.retailops.inventorysimulator.simulator.generator.components.NewsvendorMonteCarloGenerator;
import com.retailops.inventorysimulator.util.calculator.CriticalRatioCalculator;
import com.retailops.inventorysimulator.util.distribution.Normal;
import com.retailops.inventorysimulator.util.types.SimulationType;
import com.retailops.inventorysimulator.util.types.autogen.ShopType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.TreeMap;

/**
 * Service class for managing the Newsvendor model.
 * <p>
 * The Newsvendor problem determines the optimal order quantity Q*
 * under stochastic demand by balancing shortage and excess costs.
 * <p>
 * Definitions:
 * <p>
 *  Cs = Cost of shortage  = price - cost
 *  Ce = Cost of excess    = cost - g
 *  g  = Salvage value (residual value of unsold units)
 * <p>
 *  Critical Ratio (Cr):
 *      Cr = Cs / (Cs + Ce)
 * <p>
 * The optimal order quantity Q* satisfies:
 *      P(Demand ≤ Q*) ≥ Cr
 *
 * where demand is assumed to follow a normal distribution.
 * <p>
 * This service:
 *  - resolves product data
 *  - computes analytical parameters (Cr, Q*)
 *  - runs Monte Carlo simulation for expected profit
 *  - optionally persists the simulation run
 */
@Service
@RequiredArgsConstructor
public class NewsvendorService {

    private final ProductService productService;
    private final SimulationServiceModel simulationServiceModel;
    private final MonteCarloFactory monteCarloFactory;
    private final CriticalRatioCalculator criticalRatioCalculator;
    private final NewsvendorDomainService newsvendorDomainService;

    /**
     * Run a Newsvendor simulation.
     *
     * @param request  input parameters for the simulation
     * @param simId    simulation identifier (used for deterministic seeding)
     * @param shopName shop name (used for generator context)
     * @return NewsvendorResponse containing analytical and simulated results
     */
    public NewsvendorResponse simulate(
            NewsvendorRequest request,
            String simId,
            String shopName
    ) {

        // 1 Compute Critical Ratio analytically
        BigDecimal criticalRatio =
                criticalRatioCalculator.calculate(
                        request.price(),
                        request.cost(),
                        request.salvageValue()
                );

        // 2 Compute optimal order quantity Q*
        int Qstar = computeOptimalQuantity(
                request.meanDemand(),
                request.stdDeviation(),
                criticalRatio
        );

        // 3 Create seeded Monte Carlo generator
        NewsvendorMonteCarloGenerator generator =
                monteCarloFactory.newsvendor(
                        simId,
                        shopName,
                        ShopType.GENERIC_NEWSVENDOR
                );

        // 4 Run Monte Carlo simulation
        double expectedProfit = generator.simulate(
                Qstar,
                request.meanDemand(),
                request.stdDeviation(),
                request.price(),
                request.cost(),
                request.salvageValue(),
                request.simulationRuns()
        );

        // 5 Persist simulation run if requested
        if (request.saveToHistory()) {
            SimulationRun sim = SimulationRun.builder()
                    .productName(
                            request.productName() != null
                                    ? request.productName()
                                    : "custom-product"
                    )
                    .simulationType(SimulationType.NEWSVENDOR)
                    .stockQty(BigInteger.valueOf(Qstar))
                    .demand(request.meanDemand().toBigIntegerExact())
                    .profit(BigDecimal.valueOf(expectedProfit))
                    .runAt(LocalDateTime.now())
                    .username(request.usernameOrDefault())
                    .build();

            simulationServiceModel.save(sim);
        }

        // 6 Return response
        return new NewsvendorResponse(
                request.productName(),
                criticalRatio,
                BigInteger.valueOf(Qstar),
                BigDecimal.valueOf(expectedProfit),
                null
        );

    }

    /**
     * Compute the optimal order quantity Q* using the critical ratio
     * and the cumulative distribution function (CDF) of a normal distribution.
     *
     * The smallest integer Q such that:
     *      Φ((Q - μ) / σ) ≥ Cr
     *
     * is selected.
     */
    public int computeOptimalQuantity(
            BigDecimal mean,
            BigDecimal stdDev,
            BigDecimal criticalRatio
    ) {
        double mu = mean.doubleValue();
        double sigma = stdDev.doubleValue();
        double cr = criticalRatio.doubleValue();

        int q = 0;
        while (Normal.normalCDF(q, mu, sigma) < cr) {
            q++;
        }
        return q;
    }

    /**
     *
     * @param request
     * @param simId
     * @param shopName
     * @param minQ
     * @param maxQ
     * @return a map of Q → expected profit.
     *
     * Can be returned as JSON to React for charting.
     */
    public Map<Integer, Double> simulateBatch(
            NewsvendorRequest request,
            String simId,
            String shopName,
            int minQ,
            int maxQ
    ) {
        NewsvendorMonteCarloGenerator generator =
                monteCarloFactory.newsvendor(simId, shopName, ShopType.GENERIC_NEWSVENDOR);

        Map<Integer, Double> results = new LinkedHashMap<>();
        for (int q = minQ; q <= maxQ; q++) {
            double profit = generator.simulate(
                    q,
                    request.meanDemand(),
                    request.stdDeviation(),
                    request.price(),
                    request.cost(),
                    request.salvageValue(),
                    request.simulationRuns()
            );
            results.put(q, profit);
        }
        return results;
    }


    /**
     *
     * @param request
     * @param Qstar
     * @param simId
     * @param shopName
     * @return Gives a frequency map of profits, good for charting.
     */
    public Map<Integer, Integer> profitDistribution(
            NewsvendorRequest request,
            int Qstar,
            String simId,
            String shopName
    ) {
        NewsvendorMonteCarloGenerator generator =
                monteCarloFactory.newsvendor(simId, shopName, ShopType.GENERIC_NEWSVENDOR);

        Map<Integer, Integer> histogram = new TreeMap<>();

        for (int i = 0; i < request.simulationRuns(); i++) {
            double profit = generator.simulate(
                    Qstar,
                    request.meanDemand(),
                    request.stdDeviation(),
                    request.price(),
                    request.cost(),
                    request.salvageValue(),
                    1  // single run
            );
            int bucket = (int) Math.round(profit);
            histogram.put(bucket, histogram.getOrDefault(bucket, 0) + 1);
        }

        return histogram; // can be serialized to JSON
    }


}
