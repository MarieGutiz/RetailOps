import type { FC } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

interface NoSimulationLogsProps {
  simulationType: 'Newsvendor' | 'EOQ' | 'ABC';
  navigateTo?: string; // optional navigation path
}

const NoSimulationLogs: FC<NoSimulationLogsProps> = ({
  simulationType,
  navigateTo,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (navigateTo) navigate(navigateTo);
  };

  return (
    <Card className="p-4 sm:p-6 md:p-8 border border-gray-200 bg-yellow-50 flex flex-col items-center text-center gap-4">
      <h3 className="text-base sm:text-lg md:text-xl font-semibold">
        {simulationType} Analytics
      </h3>
      <p className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-md">
        No historical {simulationType.toLowerCase()} simulations found. You can
        go ahead and create some simulations to explore results and get familiar
        with the system.
      </p>
      {navigateTo && (
        <Button onClick={handleClick} className="jbtn-success w-full sm:w-auto">
          Go to {simulationType} Simulation
        </Button>
      )}
    </Card>
  );
};

export default NoSimulationLogs;
