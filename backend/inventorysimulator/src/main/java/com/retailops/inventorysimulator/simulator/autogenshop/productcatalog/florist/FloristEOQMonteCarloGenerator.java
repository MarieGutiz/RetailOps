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

package com.retailops.inventorysimulator.simulator.autogenshop.productcatalog.florist;

import com.retailops.inventorysimulator.model.Product;
import com.retailops.inventorysimulator.simulator.autogenshop.AbstractShopEoqMonteCarloGenerator;
import com.retailops.inventorysimulator.util.types.autogen.DemandModel;
import com.retailops.inventorysimulator.util.types.autogen.FloristEoqPolicy;
import com.retailops.inventorysimulator.util.types.autogen.FloristProductSpec;
import com.retailops.inventorysimulator.util.types.autogen.ShopType;
import java.util.List;

public class FloristEOQMonteCarloGenerator extends AbstractShopEoqMonteCarloGenerator<
        FloristProductSpec,
        FloristEoqPolicy> {

    private final FloristProductCatalogGenerator catalog;

    public FloristEOQMonteCarloGenerator(
            String simId,
            String shopName,
            FloristProductCatalogGenerator catalog
    ) {
        super(simId, shopName, ShopType.FLORIST);
        this.catalog = catalog;
    }

    @Override
    protected List<Product> getCatalog() {
        return catalog.generateCatalog(this.random);
    }

    @Override
    protected FloristProductSpec resolveSpec(Product product) {
        return FloristProductSpec.fromName(product.getName());
    }

    @Override
    protected FloristEoqPolicy resolvePolicy(FloristProductSpec spec) {
        return FloristEoqPolicy.forProduct(spec);
    }

    @Override
    protected DemandModel getDemandModel(FloristProductSpec spec) {
        return spec.getDemandModel();
    }

    @Override
    protected int getDemandMeanOrMin(FloristProductSpec spec) {
        return spec.getDemandMeanOrMin();
    }

    @Override
    protected int getDemandStdOrMax(FloristProductSpec spec) {
        return spec.getDemandStdOrMax();
    }

    @Override
    protected double getHoldingRate(FloristEoqPolicy policy) {
        return policy.getHoldingRate();
    }

    @Override
    protected double getMinOrderCost(FloristEoqPolicy policy) {
        return policy.getMinOrderCost();
    }

    @Override
    protected double getMaxOrderCost(FloristEoqPolicy policy) {
        return policy.getMaxOrderCost();
    }




}
