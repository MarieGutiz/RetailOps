import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ProductCardProps {
  name: string;
  stock?: number;
  description?: string;
  sku?: string;
  category?: string;
}

const ProductCard = ({name, stock, description, sku, category}: ProductCardProps) => {
  return (
    <Card className="bg-muted-foreground/5">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        {category && <CardDescription className="text-xs">{category}</CardDescription>}
      </CardHeader>
      <CardContent className="text-sm space-y-1">
        {stock !== undefined && <div>Stock: {stock}</div>}
        {sku && <div>SKU: {sku}</div>}
        {description && <div>{description}</div>}
      </CardContent>
    </Card>
  )
}

export default ProductCard