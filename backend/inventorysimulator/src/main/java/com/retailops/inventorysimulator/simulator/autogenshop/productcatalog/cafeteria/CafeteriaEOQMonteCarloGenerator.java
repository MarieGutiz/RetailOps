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
import com.retailops.inventorysimulator.simulator.autogenshop.AbstractShopEoqMonteCarloGenerator;
import com.retailops.inventorysimulator.util.types.autogen.CafeteriaEoqPolicy;
import com.retailops.inventorysimulator.util.types.autogen.CafeteriaProductSpec;
import com.retailops.inventorysimulator.util.types.autogen.DemandModel;
import com.retailops.inventorysimulator.util.types.autogen.ShopType;

import java.util.List;

public class CafeteriaEOQMonteCarloGenerator
        extends AbstractShopEoqMonteCarloGenerator<CafeteriaProductSpec, CafeteriaEoqPolicy> {

    private final CafeteriaProductCatalogGenerator catalog;

    public CafeteriaEOQMonteCarloGenerator(
            String simId,
            String shopName,
            CafeteriaProductCatalogGenerator catalog
    ) {
        super(simId, shopName, ShopType.CAFETERIA);
        this.catalog = catalog;
    }

    @Override
    protected List<Product> getCatalog() {
        return catalog.generateCatalog(this.random);
    }

    @Override
    protected CafeteriaProductSpec resolveSpec(Product product) {
        return CafeteriaProductSpec.fromName(product.getName());
    }

    @Override
    protected CafeteriaEoqPolicy resolvePolicy(CafeteriaProductSpec cafeteriaProductSpec) {
        return CafeteriaEoqPolicy.forProduct(cafeteriaProductSpec);
    }

    @Override
    protected DemandModel getDemandModel(CafeteriaProductSpec cafeteriaProductSpec) {
        return cafeteriaProductSpec.getDemandModel();
    }

    @Override
    protected int getDemandMeanOrMin(CafeteriaProductSpec cafeteriaProductSpec) {
        return cafeteriaProductSpec.getDemandMeanOrMin();
    }

    @Override
    protected int getDemandStdOrMax(CafeteriaProductSpec cafeteriaProductSpec) {
        return cafeteriaProductSpec.getDemandStdOrMax();
    }

    @Override
    protected double getHoldingRate(CafeteriaEoqPolicy cafeteriaEoqPolicy) {
        return cafeteriaEoqPolicy.getHoldingRate();
    }

    @Override
    protected double getMinOrderCost(CafeteriaEoqPolicy cafeteriaEoqPolicy) {
        return cafeteriaEoqPolicy.getMinOrderCost();
    }

    @Override
    protected double getMaxOrderCost(CafeteriaEoqPolicy cafeteriaEoqPolicy) {
        return cafeteriaEoqPolicy.getMaxOrderCost();
    }
}
