package com.retailops.inventorysimulator.simulator;

import org.apache.commons.math3.distribution.NormalDistribution;

public class NewsvendorSimulator {

    public double calculateOptimalOrderQuantity(double mean, double stddev, double underageCost, double overageCost) {
        double criticalRatio = underageCost / (underageCost + overageCost);
        NormalDistribution nd = new NormalDistribution(0, 1); // standard normal
        double zScore = nd.inverseCumulativeProbability(criticalRatio);
        return mean + zScore * stddev;
    }
}
