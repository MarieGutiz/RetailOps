import type { EoqCurvePoint, EoqCurveResponse, EoqRequest, EoqResponse } from "@/types/eoq-backend";

export const generateEOQCurve = (
  request: EoqRequest,
  response: EoqResponse,
  numPoints = 50
) => {
  const { demand: D, cost: S, holdingCost: H } = request;
  const Qstar = response.eoq;

  // Generate a range: from 50% to 150% of EOQ
  const minQ = Math.max(1, Qstar * 0.5);
  const maxQ = Qstar * 1.5;
  const step = (maxQ - minQ) / (numPoints - 1);

  const curvePoints: EoqCurvePoint[] = [];

  for (let i = 0; i < numPoints; i++) {
    const Q = minQ + i * step;
    const orderingCost = (D / Q) * S;
    const holdingCost = (Q / 2) * H;
    const totalCost = orderingCost + holdingCost;

    curvePoints.push({
      quantity: Q,
      orderingCost,
      holdingCost,
      totalCost,
    });
  }

  return {
    optimalQuantity: Qstar,
    curvePoints,
  } as EoqCurveResponse;
};