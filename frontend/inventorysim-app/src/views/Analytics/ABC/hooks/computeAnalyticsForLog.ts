import { ABCAnalysisFrontend } from '@/services/domain/segmentation/ABCAnalysisFrontend';
import { type SimulationLogEntry } from '@/views/Overview/hooks/useSimulationBitacora';

/* ------------------------------
   Frontend ABC computations
--------------------------------*/
export const computeClassicABC = (
  data: any[],
  thresholds: { a: number; b: number; c: number }
) => {
  return ABCAnalysisFrontend(data, thresholds);
};

const computeMultiABC = (
  data: any[],
  thresholds: { a: number; b: number; c: number },
  valueWeight = 0.7,
  demandWeight = 0.3
) => {
  if (!data.length) {
    return {
      table: [],
      summary: {
        totalValue: 0,
        A: { count: 0, valuePct: 0 },
        B: { count: 0, valuePct: 0 },
        C: { count: 0, valuePct: 0 },
      },
    };
  }

  const totalValue = data.reduce((s, i) => s + i.quantity, 0);
  const totalDemand = data.reduce((s, i) => s + i.demand, 0);

  const scored = data.map((i) => {
    const valueShare = i.quantity / totalValue;
    const demandShare = i.demand / totalDemand;
    const score = valueWeight * valueShare + demandWeight * demandShare;
    return { ...i, score };
  });

  const sorted = scored.sort((a, b) => b.score - a.score);

  let cumulative = 0;
  const table = sorted.map((p) => {
    cumulative += (p.quantity / totalValue) * 100;
    let category: 'A' | 'B' | 'C';
    if (cumulative <= thresholds.a) category = 'A';
    else if (cumulative <= thresholds.b) category = 'B';
    else category = 'C';
    return { ...p, cumulative, category };
  });

  const summarize = (cat: 'A' | 'B' | 'C') => {
    const subset = table.filter((r) => r.category === cat);
    const valuePct = totalValue
      ? (subset.reduce((s, r) => s + r.quantity, 0) / totalValue) * 100
      : 0;
    return { count: subset.length, valuePct };
  };

  return {
    table,
    summary: {
      totalValue,
      A: summarize('A'),
      B: summarize('B'),
      C: summarize('C'),
    },
  };
};

export const computeAnalyticsForLog = (
  log: SimulationLogEntry & { type: 'abc' },
  thresholds: { a: number; b: number }
) => {
  const mode = log.request.mode ?? 'classic';

  if (mode === 'multi') {
    const data = log.data.items.map((i) => ({
      product: i.product,
      quantity: i.salesValue,
      demand: i.demandFrequency,
    }));
    return computeMultiABC(data, { a: thresholds.a, b: thresholds.b, c: 100 });
  }

  const data = log.data.items.map((i) => ({
    product: i.product,
    quantity: i.salesValue,
  }));
  return computeClassicABC(data, { a: thresholds.a, b: thresholds.b, c: 100 });
};

export const computeDelta = (
  log: SimulationLogEntry & { type: 'abc' },
  thresholds: { a: number; b: number }
) => {
  const newAnalytics = computeAnalyticsForLog(log, thresholds);
  const newMap = new Map(
    newAnalytics.table.map((i) => [i.product.id, i.category])
  );

  let changes = 0;
  log.data.items.forEach((item) => {
    const newCat = newMap.get(item.product.id);
    if (newCat && newCat !== item.abcCategoryType) changes++;
  });

  return changes / log.data.items.length;
};
