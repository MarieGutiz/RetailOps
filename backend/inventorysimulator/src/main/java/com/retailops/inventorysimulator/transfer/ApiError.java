package com.retailops.inventorysimulator.transfer;
/**
 * Data Transfer Object representing the structure of an API error response.
 */
public record ApiError(Integer status, String message, String path) {
}

