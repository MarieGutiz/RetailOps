import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { EoqCurveResponse } from '@/types/eoq-backend';
import EoqCostCurveChart from './EoqCostCurveChart';
import { useApiErrorToast } from '@/services/api/useApiErrorToast';

interface Props {
  curve: EoqCurveResponse | null;
  isLoading?: boolean;
  error: string | null;
}

const EoqCostBreakdownPanel: React.FC<Props> = ({
  curve,
  isLoading,
  error,
}) => {
  // Toast if API error exists
  useApiErrorToast(error, 'EOQ Curve Error');

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle>EOQ Cost Curve Analysis</CardTitle>
      </CardHeader>

      <CardContent className="h-[420px] flex flex-col">
        {/* Loading */}
        {isLoading && (
          <div className="flex-1 flex items-center justify-center text-sm text-gray-500">
            Generating cost curve...
          </div>
        )}

        {/* Error Panel */}
        {!isLoading && error && (
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              Unable to load EOQ cost curve. Please try again.
            </div>
          </div>
        )}

        {/* Chart */}
        {!isLoading && !error && curve && curve?.curvePoints?.length > 0 && (
          <EoqCostCurveChart curve={curve} />
        )}

        {/* Empty state */}
        {!isLoading && !error && (!curve || curve.curvePoints.length === 0) && (
          <div className="flex-1 flex items-center justify-center text-sm text-gray-500">
            No cost curve data available.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EoqCostBreakdownPanel;
