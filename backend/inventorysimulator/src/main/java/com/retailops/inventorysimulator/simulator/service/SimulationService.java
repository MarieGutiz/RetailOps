package com.retailops.inventorysimulator.simulator.service;


import com.retailops.inventorysimulator.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SimulationService {
    final ProductService productService;


}
