import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useProductStore } from "@/store/useProductStore";
import { AlertCircle } from "lucide-react";

const GuestLimitAlert = () => {
 const isAuth = useProductStore((s) => s.isAuthenticated);

  if (isAuth) return null; // Authenticated users should NEVER see this

  return (
    <div className="px-4 mt-2">
      <Alert variant="default" className="bg-yellow-50 border-yellow-400 text-yellow-900">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Guest Mode Active</AlertTitle>
        <AlertDescription>
          You can add up to <strong>10 products</strong>. Create a free account to unlock
          unlimited product storage and syncing with your backend.
        </AlertDescription>
      </Alert>
    </div>
  );
}

export default GuestLimitAlert