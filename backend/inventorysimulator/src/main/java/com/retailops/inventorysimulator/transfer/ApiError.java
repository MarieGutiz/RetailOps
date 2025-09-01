package com.retailops.inventorysimulator.transfer;

public record ApiError(Integer status, String message, String path) {
}

