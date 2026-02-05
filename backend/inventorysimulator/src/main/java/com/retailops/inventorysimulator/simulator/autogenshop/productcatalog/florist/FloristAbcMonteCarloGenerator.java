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
import com.retailops.inventorysimulator.simulator.autogenshop.productcatalog.AbstractShopMonteCarloGenerator;import com.retailops.inventorysimulator.util.distribution.Normal;
import com.retailops.inventorysimulator.util.types.autogen.DemandModel;
import com.retailops.inventorysimulator.util.types.autogen.FloristProductSpec;
import com.retailops.inventorysimulator.util.types.autogen.ShopType;
import java.util.List;


public class FloristAbcMonteCarloGenerator extends AbstractShopMonteCarloGenerator<FloristProductSpec> {


    private final FloristProductCatalogGenerator catalogGenerator;

    /**
     * Constructor.
     *
     * @param simId            simulation identifier
     * @param shopName         florist shop name
     * @param catalogGenerator generator of florist products
     */
    public FloristAbcMonteCarloGenerator(
            String simId,
            String shopName,
            FloristProductCatalogGenerator catalogGenerator
    ) {
        super(simId, shopName, ShopType.FLORIST);
        this.catalogGenerator = catalogGenerator;
    }


    @Override
    protected List<Product> getCatalog() {
        return catalogGenerator.generateCatalog(random);
    }

    @Override
    protected FloristProductSpec[] getSpecs() {
        return FloristProductSpec.values();
    }

    @Override
    protected DemandModel getDemandModel(FloristProductSpec spec) {
        return switch (spec.getDemandModel()) {
            case NORMAL -> DemandModel.NORMAL;
            case UNIFORM -> DemandModel.UNIFORM;
        };
    }

    @Override
    protected int getDemandMeanOrMin(FloristProductSpec spec) {
        return spec.getDemandMeanOrMin();
    }

    @Override
    protected int getDemandStdOrMax(FloristProductSpec spec) {
        return spec.getDemandStdOrMax();
    }

}
