import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';
import type { ParetoPoint } from '@/types/abc';
import { useEffect, useMemo, useState } from 'react';
import {
  Line,
  XAxis,
  CartesianGrid,
  ResponsiveContainer,
  YAxis,
  Tooltip,
  Bar,
  ComposedChart,
  Cell,
  ReferenceLine,
  Brush,
} from 'recharts';
import ParetoPlotFooter from './ParetoPlotFooter';
import CardHeaderPlot, { type ViewMode } from './CardHeaderPlot';

const chartConfig = {
  metric: {
    label: 'Total Value',
    color: 'var(--chart-2)',
  },
  cumulativePct: {
    label: 'Cumulative %',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

const abcColors = {
  A: 'var(--chart-1)',
  B: 'var(--chart-2)',
  C: 'var(--chart-3)',
};

export function ParetoCurveView({
  data,
  hoveredCategory,
  onHover,
}: {
  data: ParetoPoint[];
  hoveredCategory: 'A' | 'B' | 'C' | null;
  onHover: (category: 'A' | 'B' | 'C' | null) => void;
}) {
  const cutoffPct = 80;

  /**
   * Finds the first product that pushes cumulative % ≥ 80
   */
  const cutoffCount = useMemo(() => {
    const index = data.findIndex((d) => d.cumulativePct >= cutoffPct);
    return index === -1 ? data.length : index + 1;
  }, [data]);

  const [hoveredItem, setHoveredItem] = useState<ParetoPoint | null>(null);
  const dense = data.length > 40;

  const [viewMode, setViewMode] = useState<ViewMode>('all');

  const visibleData = useMemo(() => {
    switch (viewMode) {
      case 'top10':
        return data.slice(0, 10);
      case 'top20':
        return data.slice(0, 20);
      case 'top50':
        return data.slice(0, 50);
      case 'pareto':
        return data.slice(0, cutoffCount);
      default:
        return data;
    }
  }, [data, viewMode, cutoffCount]);

  //  useEffect(() => {
  //   console.log("hoveredCategory changed:", hoveredCategory);
  //   console.log("visibleData categories:", visibleData.map(d => ({ name: d.name, category: d.category })));
  // }, [hoveredCategory, visibleData]);
  return (
    <Card className="shadow-sm overflow-hidden">
      <CardHeader>
        <CardTitle>Pareto Curve Plot</CardTitle>
        <CardDescription>
          Cumulative value contribution of inventory items by ABC classification
        </CardDescription>
        <CardHeaderPlot viewMode={viewMode} setViewMode={setViewMode} />
      </CardHeader>

      <CardContent>
        <ChartContainer className="w-full" config={chartConfig}>
          <ComposedChart data={visibleData}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />

            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tick={false} // many products → cleaner
            />

            {/* Left axis: metrics */}
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              label={{
                value: 'Total value',
                angle: -90,
                position: 'insideLeft',
              }}
            />

            {/* Right axis: cumulative % */}
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
              tickFormatter={(v) => `${v}%`}
              tickLine={false}
              axisLine={false}
              label={{
                value: 'Cumulative contribution (%)',
                angle: 90,
                position: 'insideRight',
                offset: 10,
              }}
            />

            {/* 80% Pareto cutoff */}
            <ReferenceLine
              yAxisId="right"
              y={80}
              stroke="var(--chart-1)"
              strokeDasharray="4 4"
              label={{
                value: '',
                position: 'right',
                fill: 'var(--muted-foreground)',
                fontSize: 12,
              }}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;

                const p = payload[0].payload as ParetoPoint;

                return (
                  <div className="rounded-md border bg-background p-2 text-sm shadow space-y-1">
                    <div className="font-medium">{p.name}</div>

                    <div>Total value: {p.metric.toLocaleString()}</div>

                    <div>
                      ABC class: <b>{p.category}</b>
                    </div>

                    {p.categoryContributionPct != null && (
                      <div>
                        Class contribution:{' '}
                        <b>{p.categoryContributionPct.toFixed(1)}%</b>
                      </div>
                    )}

                    <div className="text-muted-foreground">
                      Cumulative: {p.cumulativePct.toFixed(1)}%
                    </div>
                  </div>
                );
              }}
            />

            {/* Bars */}
            <Bar
              yAxisId="left"
              dataKey="metric"
              radius={dense ? 0 : [4, 4, 0, 0]}
              name="Total Value"
              onMouseEnter={(_, index) => {
                // setHoveredItem(visibleData[index])

                const item = visibleData[index];
                setHoveredItem(item);
                onHover(item.category);
                // console.log("Bar hover → item:", item.name, "category:", item.category, "hoveredCategory:", hoveredCategory);
              }}
              onMouseLeave={() => {
                setHoveredItem(null);
                onHover(null);
              }}
            >
              {visibleData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={abcColors[entry.category]}
                  fillOpacity={
                    // hoveredCategory && hoveredCategory !== entry.category ? 0.3 : 0.85
                    hoveredCategory
                      ? entry.category === hoveredCategory
                        ? 0.9
                        : 0.1
                      : 0.85
                  }
                />
              ))}
            </Bar>

            {/* Cumulative line */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="cumulativePct"
              stroke="var(--color-cumulativePct)"
              strokeWidth={3} // thicker
              dot={!dense}
              activeDot={!dense ? { r: 6 } : false}
              isAnimationActive={false}
              name="Cumulative %"
            />

            <Brush
              dataKey="name"
              height={24}
              travellerWidth={10}
              stroke="var(--muted-foreground)"
            />
          </ComposedChart>
        </ChartContainer>
        <span className="text-xs text-muted-foreground">
          Showing {visibleData.length} of {data.length} products
        </span>
      </CardContent>
      <ParetoPlotFooter
        hoveredItem={hoveredItem}
        cutoffCount={cutoffCount}
        hoveredCategory={hoveredCategory}
        cutoffPct={cutoffPct}
      />
    </Card>
  );
}

export default ParetoCurveView;
