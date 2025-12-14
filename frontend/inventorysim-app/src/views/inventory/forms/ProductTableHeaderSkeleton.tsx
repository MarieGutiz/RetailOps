import { Skeleton } from "@/components/ui/skeleton"

const ProductTableHeaderSkeleton = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between w-full">
      {/* Search skeleton */}
      <Skeleton className="h-9 w-full max-w-[14rem] sm:max-w-xs md:max-w-sm rounded-md" />

      {/* Filters skeleton */}
      <div className="flex gap-2">
        <Skeleton className="h-9 w-[100px] rounded-md" />
        <Skeleton className="h-9 w-[100px] rounded-md" />
      </div>
    </div>
  )
}

export default ProductTableHeaderSkeleton