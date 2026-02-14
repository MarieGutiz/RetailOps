package com.retailops.inventorysimulator.simulator.service;


import com.retailops.inventorysimulator.model.SimulationRun;
import com.retailops.inventorysimulator.service.ProductService;
import com.retailops.inventorysimulator.service.SimulationServiceModel;
import com.retailops.inventorysimulator.simulator.autogenshop.MonteCarloFactory;
import com.retailops.inventorysimulator.simulator.dto.NewsvendorRequest;
import com.retailops.inventorysimulator.simulator.dto.NewsvendorResponse;
import com.retailops.inventorysimulator.simulator.dto.ProfitDistributionResult;
import com.retailops.inventorysimulator.simulator.generator.model.newsvendor.NewsvendorMonteCarloGenerator;
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

        // 1 Compute Critical Ratio (mode-aware)
        BigDecimal criticalRatio = switch (request.mode()) {

            case CLASSIC -> CriticalRatioCalculator.calculateBasic(
                    request.price(),
                    request.cost()
            );

            case ADVANCED -> CriticalRatioCalculator.calculateAdvanced(
                    request.price(),
                    request.cost(),
                    request.salvageValue(),
                    request.penalty()
            );
        };

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
                request.salvageValue(),   // ignored economically in CLASSIC
                request.simulationRuns()
        );

        // 5 Compute achieved service level
        BigDecimal serviceLevel = BigDecimal.valueOf(
                Normal.normalCDF(
                        Qstar,
                        request.meanDemand().doubleValue(),
                        request.stdDeviation().doubleValue()
                )
        );

        // 6 Persist simulation run if requested
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

        // 7 Return response
        return new NewsvendorResponse(
                request.productName(),
                criticalRatio,
                BigInteger.valueOf(Qstar),
                BigDecimal.valueOf(expectedProfit),
                serviceLevel
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
    public ProfitDistributionResult profitDistribution(
            NewsvendorRequest request,
            int Qstar,
            String simId,
            String shopName
    ) {
        NewsvendorMonteCarloGenerator generator =
                monteCarloFactory.newsvendor(simId, shopName, ShopType.GENERIC_NEWSVENDOR);

        Map<Integer, Integer> histogram = new TreeMap<>();

        int runs = request.simulationRuns();
        int bucketSize = 10;//Bigger buckets for better plot

        double sum = 0;
        double sumSq = 0;
        int lossCount = 0;

        double minProfit = Double.MAX_VALUE;
        double maxProfit = Double.MIN_VALUE;

        for (int i = 0; i < runs; i++) {
            double profit = generator.simulate(
                    Qstar,
                    request.meanDemand(),
                    request.stdDeviation(),
                    request.price(),
                    request.cost(),
                    request.salvageValue(),
                    1  // single run
            );
            // Update stats
            sum += profit;
            sumSq += profit * profit;

            if (profit < 0) {
                lossCount++;
            }

            minProfit = Math.min(minProfit, profit);
            maxProfit = Math.max(maxProfit, profit);

            // Bucket logic
            int bucket = ((int) Math.floor(profit / bucketSize)) * bucketSize;

            histogram.put(bucket,
                    histogram.getOrDefault(bucket, 0) + 1);

        }

        double expected = sum / runs;
        double variance = (sumSq / runs) - (expected * expected);
        double probabilityOfLoss = (double) lossCount / runs;

        return new ProfitDistributionResult(
                histogram,
                expected,
                variance,
                probabilityOfLoss,
                minProfit,
                maxProfit
        );
        // can be serialized to JSON
    }

    //Check for chart points
    public Map<Double, Double> normalPDF(
            BigDecimal mean,
            BigDecimal stdDev,
            double min,
            double max,
            double step,
            String simId
    ) {

        if(simId == null) {return null;}
        Map<Double, Double> pdf = new LinkedHashMap<>();
        double mu = mean.doubleValue();
        double sigma = stdDev.doubleValue();
        for (double x = min; x <= max; x += step) {
            double y = (1 / (sigma * Math.sqrt(2 * Math.PI)))
                    * Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
            pdf.put(x, y);
        }
        return pdf;
    }



}
