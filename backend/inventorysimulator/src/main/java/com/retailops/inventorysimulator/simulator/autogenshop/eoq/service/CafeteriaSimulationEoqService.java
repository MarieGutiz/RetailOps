/*
 *
 *  * Copyright (c) 2026
 *  * Author: Mariela Paola Gutierrez
 *  * Repository: https://github.com/mariegutiz
 *  *
 *  * Licensed under the MIT License. You may obtain a copy of the License at:
 *  *     https://opensource.org/licenses/MIT
 *  *
 *  *
 *  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 *
 *
 */

package com.retailops.inventorysimulator.simulator.autogenshop.eoq.service;

import com.retailops.inventorysimulator.simulator.autogenshop.MonteCarloFactory;
import com.retailops.inventorysimulator.simulator.autogenshop.productcatalog.cafeteria.CafeteriaEOQMonteCarloGenerator;
import com.retailops.inventorysimulator.simulator.service.EoqService;
import com.retailops.inventorysimulator.util.types.autogen.ShopType;
import org.springframework.stereotype.Service;

/**
 * Concrete EOQ simulation service for cafeteria shops.
 *
 * <p>Provides a cafeteria-specific Monte Carlo generator for running EOQ
 * simulations via {@link AbstractShopSimulationEOQService}.</p>
 */

@Service
public class CafeteriaSimulationEoqService extends AbstractShopSimulationEOQService<CafeteriaEOQMonteCarloGenerator> {

  public CafeteriaSimulationEoqService(
          MonteCarloFactory monteCarloFactory,
          EoqService eoqService) {
       super(monteCarloFactory, eoqService);

  }

  @Override
  protected CafeteriaEOQMonteCarloGenerator createGenerator(String simId) {
    return factory.eoqCafeteria(simId, ShopType.CAFETERIA.toString());
  }
}
