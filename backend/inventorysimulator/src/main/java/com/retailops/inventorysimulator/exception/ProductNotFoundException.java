package com.retailops.inventorysimulator.exception;

/**
 * Custom runtime exception thrown when a product with the specified id
 * cannot be found in the system.
 */
public class ProductNotFoundException extends RuntimeException {
    public ProductNotFoundException(Long id) {
        super("Product with id " + id + " not found");
    }

}
