import  { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";

interface ServiceUnavailableProps {
  onCreateShop: () => void;
}

const ServiceUnavailable = ({ onCreateShop }: ServiceUnavailableProps) => {
  return (
   <Card className="mb-4 border-dashed">
      <CardContent className="flex items-center justify-between py-4">
        <div>
          <p className="font-medium">No shop available yet</p>
          <p className="text-sm text-muted-foreground">
            The server is offline. Create your own shop to start working locally.
          </p>
        </div>

        <Button 
        className="jbtn-passive"
        onClick={onCreateShop}>
          Create your shop
        </Button>
      </CardContent>
    </Card>
  )
}

export default ServiceUnavailable