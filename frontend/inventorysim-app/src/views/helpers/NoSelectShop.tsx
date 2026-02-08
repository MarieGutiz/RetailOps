import { useNavigate } from "react-router-dom";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

const NoSelectShop = () => {
      const navigate = useNavigate();

  return (
         <div
      className="
        -mt-2 mb-4 px-4
        text-[0.70rem] sm:text-xs md:text-sm lg:text-base
        flex flex-col items-center justify-center h-full text-center text-muted-foreground
      "
    >
      <Alert
        variant="default"
        className="
          bg-yellow-50 border-yellow-400 text-yellow-900
          p-2 sm:p-3 md:p-3.5 lg:p-4
          max-w-md
        "
      >
        <AlertCircle
          className="
            h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4 md:w-4 lg:h-5 lg:w-5
            mb-2
          "
        />

        <AlertTitle className="text-xs sm:text-sm md:text-sm lg:text-base mb-1">
          No Shop Selected
        </AlertTitle>

        <AlertDescription className="text-[0.70rem] sm:text-xs md:text-sm lg:text-sm">
          You need to create a shop before running simulations or viewing inventory.
          <br /><br />
          You can either:
          <ul className="list-disc list-inside mt-1 text-left ml-4">
            <li>
              Go to <strong>Dashboard Overview</strong> and use the <strong>Create Shop</strong> button.
            </li>
            <li>
              Go to <strong>Inventory → Product Library</strong> to create a shop and start adding products.
            </li>
          </ul>
          <br />
          <Button
            onClick={() => navigate("/dashboard/inventory/products")}
            className="text-blue-600 hover:underline font-semibold mt-2 inline-block"
          >
            Go to Inventory Product Library &rarr;
          </Button>
        </AlertDescription>
      </Alert>
    </div>

  );
}

export default NoSelectShop