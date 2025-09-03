package com.retailops.inventorysimulator.service;

import com.retailops.inventorysimulator.model.Product;

import java.util.Optional;

public interface ProductService extends BaseService<Product, Long> {

    Optional<Product> updateProduct(Long id, Product updatedProduct);
}
