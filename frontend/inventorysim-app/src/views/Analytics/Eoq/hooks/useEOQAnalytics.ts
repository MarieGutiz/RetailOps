import { useMemo } from "react";

interface EOQParams {
  demand: number;        // D
  orderingCost: number;  // S
  holdingCost: number;   // H
}

export interface EOQAnalyticsResult {
  eoq: number;
  totalCost: number;
  orderingCostComponent: number;
  holdingCostComponent: number;
  ordersPerYear: number;
  cycleTime: number;
}

export const useEOQAnalytics = ({
  demand,
  orderingCost,
  holdingCost,
}: EOQParams): EOQAnalyticsResult => {

  return useMemo(() => {
    if (demand <= 0 || orderingCost <= 0 || holdingCost <= 0) {
      return {
        eoq: 0,
        totalCost: 0,
        orderingCostComponent: 0,
        holdingCostComponent: 0,
        ordersPerYear: 0,
        cycleTime: 0,
      };
    }

    const eoq = Math.sqrt((2 * demand * orderingCost) / holdingCost);

    const orderingCostComponent = (demand / eoq) * orderingCost;
    const holdingCostComponent = (eoq / 2) * holdingCost;
    const totalCost = orderingCostComponent + holdingCostComponent;

    const ordersPerYear = demand / eoq;
    const cycleTime = eoq / demand; // fraction of year

    return {
      eoq,
      totalCost,
      orderingCostComponent,
      holdingCostComponent,
      ordersPerYear,
      cycleTime,
    };
  }, [demand, orderingCost, holdingCost]);
};