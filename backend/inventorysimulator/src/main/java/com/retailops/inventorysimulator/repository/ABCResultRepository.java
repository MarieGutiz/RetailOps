/*
 * Copyright (c) 2025. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package com.retailops.inventorysimulator.repository;

import com.retailops.inventorysimulator.model.ABCResult;
import com.retailops.inventorysimulator.util.types.ABCCategoryType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Handles ABCResult DB operations
 */
@Repository
public interface ABCResultRepository extends JpaRepository<ABCResult, Long> {
    List<ABCResult> findByAbcClass(ABCCategoryType abcClass);
    List<ABCResult> findBySimulationRunId(Long simulationRunId);

}
