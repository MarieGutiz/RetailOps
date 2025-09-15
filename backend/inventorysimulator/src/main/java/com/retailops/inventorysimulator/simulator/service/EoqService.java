package com.retailops.inventorysimulator.simulator.service;

import com.retailops.inventorysimulator.exception.ProductNotFoundException;
import com.retailops.inventorysimulator.model.Product;
import com.retailops.inventorysimulator.model.SimulationRun;
import com.retailops.inventorysimulator.service.ProductService;
import com.retailops.inventorysimulator.service.SimulationServiceModel;
import com.retailops.inventorysimulator.simulator.dto.EoqRequestDto;
import com.retailops.inventorysimulator.simulator.dto.EoqResponseDto;
import com.retailops.inventorysimulator.simulator.dto.NewsVendorResponse;
import com.retailops.inventorysimulator.util.SimulationType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static com.retailops.inventorysimulator.simulator.EoqCalculator.calculateEOQ;

@Service
@RequiredArgsConstructor
public class EoqService {
    final SimulationServiceModel simulationServiceModel;
    final ProductService productService;

    public EoqResponseDto runEoq(EoqRequestDto eoqRequestDto) {
        Product product = productService.getProduct(eoqRequestDto.productId())
                .orElseThrow(() -> new ProductNotFoundException(eoqRequestDto.productId()));

        //BigDecimal eoq = Math.sqrt((2 * eoqRequestDto.demand().multiply(eoqRequestDto.cost()) ) / eoqRequestDto.holdingCost());
        BigDecimal eoq = calculateEOQ(eoqRequestDto.demand(),
                                    eoqRequestDto.cost(),
                                    eoqRequestDto.holdingCost());

        if(eoqRequestDto.saveToHistory()){
            SimulationRun run = new SimulationRun();
            run.setSimulationType(SimulationType.EOQ);
            run.setProductName(product.getName());
            run.setDemand(eoqRequestDto.demand());
            run.setSetupCost(eoqRequestDto.cost());
            run.setHoldingCost(eoqRequestDto.holdingCost());
            run.setEoq(eoq);
            run.setUsername(eoqRequestDto.username());
            run.setRunAt(LocalDateTime.now());

            simulationServiceModel.save(run);
        }

        return new EoqResponseDto(
                product.getName(),
                eoqRequestDto.demand(),
                eoqRequestDto.cost(),
                eoqRequestDto.holdingCost(),
                eoq
        );

    }
}
