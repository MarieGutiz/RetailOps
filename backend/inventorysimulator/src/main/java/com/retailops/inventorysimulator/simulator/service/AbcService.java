package com.retailops.inventorysimulator.simulator.service;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.retailops.inventorysimulator.model.SimulationRun;
import com.retailops.inventorysimulator.service.SimulationServiceModel;
import com.retailops.inventorysimulator.simulator.dto.AbcItemDto;
import com.retailops.inventorysimulator.simulator.dto.AbcResultDto;
import com.retailops.inventorysimulator.util.SimulationType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@RequiredArgsConstructor
@Service
public class AbcService {
    private final ObjectMapper objectMapper;
    private final SimulationServiceModel simulationServiceModel;

    public void runAbc(List<AbcItemDto> items, String username) {
        // Sort items by sales value descending ??
        items.sort(Comparator.comparingDouble(AbcItemDto::getSalesValue).reversed());

        double totalSales = items.stream().mapToDouble(AbcItemDto::getSalesValue).sum();
        double cumulative = 0;

        List<AbcResultDto> results = new ArrayList<>();

        for (AbcItemDto item : items) {
            cumulative += item.getSalesValue();
            double percentage = (cumulative / totalSales) * 100;
            //Implement the power law

            String category;
            if (percentage <= 20) {
                category = "A";
            } else if (percentage <= 50) {
                category = "B";
            } else {
                category = "C";
            }

            AbcResultDto result = new AbcResultDto();
            result.setProductName(item.getProductName());
            result.setSalesValue(item.getSalesValue());
            result.setCategory(category);
            results.add(result);
        }

        SimulationRun run = new SimulationRun();
        run.setSimulationType(SimulationType.ABC);
        run.setUsername(username);
        run.setRunAt(LocalDateTime.now());

        try {
            run.setAbcInputJson(objectMapper.writeValueAsString(items));
            run.setAbcResultJson(objectMapper.writeValueAsString(results));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize ABC data", e);
        }

         simulationServiceModel.save(run);
    }
}
