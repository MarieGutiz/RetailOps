/*
 * Copyright (c) 2025. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package com.retailops.inventorysimulator.util.distribution;

import java.util.Random;

/**
 * Utility class for generating and analyzing normal (Gaussian) distributions.
 *
 * Includes a high-performance approximation of the error function (Abramowitz & Stegun, 1964).</p>
 */
public class Normal {

    private static final Random random = new Random();

    /**
     * Generate a random number following a normal distribution N(mean, stdDev).
     */
    public static double normal(double mean, double stdDev) {
        return mean + stdDev * random.nextGaussian();
    }

    public static double normal(double mean, double stdDev, Random random) {
        return mean + stdDev * random.nextGaussian();
    }


    /**
     * Generate multiple normal-distributed samples.
     */
    public static double[] normalSamples(double mean, double stdDev, int n) {
        double[] samples = new double[n];
        for (int i = 0; i < n; i++) {
            samples[i] = normal(mean, stdDev);
        }
        return samples;
    }

    /**
     * Probability density function (PDF) of Normal distribution.
     */
    public static double normalPDF(double x, double mean, double stdDev) {
        double exponent = Math.exp(-Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2)));
        return (1.0 / (stdDev * Math.sqrt(2 * Math.PI))) * exponent;
    }

    /**
     * Cumulative distribution function (CDF) approximation of Normal distribution.
     * Uses Abramowitz-Stegun formula for error function approximation.
     */
    public static double normalCDF(double x, double mean, double stdDev) {
        return 0.5 * (1 + erf((x - mean) / (stdDev * Math.sqrt(2))));
    }

    /**
     * Error function approximation (Abramowitz and Stegun, 1964).
     */
    private static double erf(double z) {
        // constants
        double t = 1.0 / (1.0 + 0.5 * Math.abs(z));
        // Horner’s method polynomial approximation
        double ans = 1 - t * Math.exp(-z * z - 1.26551223 +
                t * (1.00002368 +
                        t * (0.37409196 +
                                t * (0.09678418 +
                                        t * (-0.18628806 +
                                                t * (0.27886807 +
                                                        t * (-1.13520398 +
                                                                t * (1.48851587 +
                                                                        t * (-0.82215223 +
                                                                                t * 0.17087277)))))))));
        return z >= 0 ? ans : -ans;
    }
}
