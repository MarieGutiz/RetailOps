import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/Button';
import { AlertCircle } from 'lucide-react';

//Component to show when no shop is selected in the dashboard pitacora.
// It will guide the user to create a shop in order to proceed.

type Props = {
  onCreateShop: () => void;
};
const NoShopSelectedAlert = ({ onCreateShop }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted-foreground">
      <Alert
        variant="default"
        className="
          bg-yellow-50 border-yellow-400 text-yellow-900
          p-4 sm:p-5 md:p-6 max-w-md"
      >
        <AlertCircle className="h-5 w-5 mb-2" />
        <AlertTitle>No Shop Selected</AlertTitle>
        <AlertDescription className="mt-1">
          To view the dashboard pitácora, you need to create a shop first.
          <div className="flex justify-center mt-2">
            <Button onClick={onCreateShop} className="jbtn-success">
              Create a Shop
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default NoShopSelectedAlert;
