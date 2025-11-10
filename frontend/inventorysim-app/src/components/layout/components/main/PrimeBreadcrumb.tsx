import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator} from '@/components/ui/breadcrumb'


const PrimeBreadcrumb = ({trail}:{trail: {label: string, path?: string}[]}) => {
  return (
    <Breadcrumb className="mb-3">
      <BreadcrumbList>
        {trail.map((item, index) => (
          <BreadcrumbItem key={index}>
            <BreadcrumbLink href={item.path || "#"} className="text-primary/80 hover:underline">
              {item.label}
            </BreadcrumbLink>
            {index < trail.length - 1 && <BreadcrumbSeparator />}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default PrimeBreadcrumb