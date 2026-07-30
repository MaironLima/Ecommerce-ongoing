import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface UniversalBreadcrumProps {
  labels: string[];
  className?: string;
}

function UniversalBreadcrum({ labels, className }: UniversalBreadcrumProps) {
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {labels.map((label, i) => {
          const isLast = i === labels.length - 1;
          return (
            <React.Fragment key={i}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="capitalize">{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href="#" className="capitalize">
                    {label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default UniversalBreadcrum;