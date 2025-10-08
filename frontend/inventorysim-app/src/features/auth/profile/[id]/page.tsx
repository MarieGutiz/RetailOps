import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfilePageProps {
  params: {
    id: string;
    email?: string;
  };
}

const page = async ({ params }: ProfilePageProps) => {
  return (
    <div>
        
        <Card className="p-6">
            <CardHeader>
              <CardTitle className="text-xl">Hello, {params.email}</CardTitle>
              <CardDescription>Details for user ID: {params.id}</CardDescription>
            </CardHeader>
        </Card>
    </div>
  )
}

export default page