import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import React from 'react';


//Reusable breadcrum component

const PrimeBreadcrumb = ({
  trail,
}: {
  trail: { label: string; path?: string }[];
}) => {
  return (
    <Breadcrumb className="mb-3 text-xs sm:text-sm md:text-base">
      <BreadcrumbList>
        {trail.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              <BreadcrumbLink
                href={item.path || '#'}
                className="text-primary/80 hover:underline"
              >
                {item.label}
              </BreadcrumbLink>
            </BreadcrumbItem>

            {index < trail.length - 1 && (
              <BreadcrumbSeparator className="mx-1 sm:mx-2" />
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default PrimeBreadcrumb;
