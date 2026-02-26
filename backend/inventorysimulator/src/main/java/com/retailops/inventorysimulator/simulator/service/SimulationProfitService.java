package com.retailops.inventorysimulator.simulator.service;

import com.retailops.inventorysimulator.model.SimulationRun;
import com.retailops.inventorysimulator.service.SimulationServiceModel;
import com.retailops.inventorysimulator.simulator.dto.ProfitRequest;
import com.retailops.inventorysimulator.simulator.dto.ProfitResponse;
import com.retailops.inventorysimulator.simulator.dto.SimulationRunDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
public class SimulationProfitService {
    final SimulationServiceModel simulationServiceModel;

    public ProfitResponse calculateProfit(ProfitRequest request) {

        BigInteger stock = request.stockQtyOrDefault();
        BigInteger demand = request.demandOrDefault();
        BigInteger sales = stock.min(demand); // BigInteger.min

        // Revenue = sales * unitPrice
        BigDecimal revenue = request.price().multiply(new BigDecimal(sales));

        // Cost = stock * unitCost
        BigDecimal cost = request.cost().multiply(new BigDecimal(stock));

        // Profit = revenue - cost, rounded to 2 decimals
        BigDecimal profit = revenue.subtract(cost).setScale(2, RoundingMode.HALF_UP);//        }

        return new ProfitResponse(
                request.productName(),
                stock,
                demand,
                profit
        );
    }

    public Page<SimulationRunDTO> getHistory(String username, int page, int size) {
         return simulationServiceModel.getHistory(username, page, size);
    }


}
