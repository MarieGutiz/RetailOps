import { Card } from "@/components/ui/card"
import ModuleContainer from "../../ModuleContainer"
import { useSelectedShop } from "@/hooks/shop/useSelectedShop";
import NoShopSelectedAlert from "@/components/layout/context/NoShopSelectedAlert";
import ShopCreationWizardDialog from "@/views/inventory/forms/ShopCreationWizardDialog";
import { useState } from "react";

const DashboardOverviewModule = () => {
//   useEffect(() => {
//    testFloristFlowLocal();
//   // testShopABCLive("FLORIST", "classic");
// }, []);

const { shop: selectedShop } = useSelectedShop();
  const [wizardOpen, setWizardOpen] = useState(false);

  const handleShopCreated = () => {
    setWizardOpen(false);
    // The shop store should automatically update selectedShop via context/hooks
  };

  return (
    <ModuleContainer
      title="Dashboard Overview"
      subtitle="Dashboard summary"
     >
         {!selectedShop ? (
        <>
          <NoShopSelectedAlert onCreateShop={() => setWizardOpen(true)} />
          <ShopCreationWizardDialog
            open={wizardOpen}
            onOpenChange={setWizardOpen}
            onShopCreated={handleShopCreated}
          />
        </>
      ) : (
        <Card className="p-6">
          {/* Replace this with your actual overview content / logs */}
          Dashboard Overview Content for <strong>{selectedShop.name}</strong>
        </Card>
      )}
     </ModuleContainer>
  )
}

export default DashboardOverviewModule