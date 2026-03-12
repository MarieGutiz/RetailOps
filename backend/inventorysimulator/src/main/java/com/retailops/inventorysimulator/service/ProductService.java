package com.retailops.inventorysimulator.service;

import com.retailops.inventorysimulator.model.Product;

import java.util.List;
import java.util.Optional;

/**
 * Service interface for managing {@link Product} entities, extending
 * basic CRUD operations from {@link BaseService}.
 *
 * NOTE: I am not using prdct persitence for now.
 */

public interface ProductService extends BaseService<Product, Long> {

    Optional<Product> updateProduct(Long id, Product updatedProduct);

    Optional<Product> getProduct(Long id);

    List<Product> saveAll(List<Product> products);

    Optional<Product> findByName(String s);
}
