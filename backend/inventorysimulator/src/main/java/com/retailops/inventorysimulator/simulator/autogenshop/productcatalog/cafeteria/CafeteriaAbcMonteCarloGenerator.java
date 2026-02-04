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

package com.retailops.inventorysimulator.simulator.autogenshop.productcatalog.cafeteria;

import com.retailops.inventorysimulator.model.Product;
import com.retailops.inventorysimulator.simulator.autogenshop.productcatalog.AbstractShopMonteCarloGenerator;
import com.retailops.inventorysimulator.util.types.autogen.CafeteriaProductSpec;
import com.retailops.inventorysimulator.util.types.autogen.DemandModel;
import com.retailops.inventorysimulator.util.types.autogen.ShopType;

import java.util.List;


/**
 * Cafeteria ABC Monte Carlo generator.
 * <p>
 * Only implements shop-specific details, reuses shared generation logic.
 */
public class CafeteriaAbcMonteCarloGenerator extends AbstractShopMonteCarloGenerator<CafeteriaProductSpec> {


    private final CafeteriaProductCatalogGenerator catalogGenerator;

    /**
     * Constructor.
     *
     * @param simId            simulation identifier
     * @param shopName         cafeteria shop name
     * @param catalogGenerator generator of cafeteria products
     */
    public CafeteriaAbcMonteCarloGenerator(
            String simId,
            String shopName,
            CafeteriaProductCatalogGenerator catalogGenerator
    ) {
        super(simId, shopName, ShopType.CAFETERIA);
        this.catalogGenerator = catalogGenerator;
    }

    @Override
    protected List<Product> getCatalog() {
        return catalogGenerator.generateCatalog(random);
    }

    @Override
    protected CafeteriaProductSpec[] getSpecs() {
        return CafeteriaProductSpec.values();
    }

    @Override
    protected DemandModel getDemandModel(CafeteriaProductSpec spec) {
        return switch (spec.getDemandModel()) {
            case NORMAL -> DemandModel.NORMAL;
            case UNIFORM -> DemandModel.UNIFORM;
        };
    }

    @Override
    protected int getDemandMeanOrMin(CafeteriaProductSpec spec) {
        return spec.getDemandMeanOrMin();
    }

    @Override
    protected int getDemandStdOrMax(CafeteriaProductSpec spec) {
        return spec.getDemandStdOrMax();
    }
}
