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
            <BreadcrumbItem key={i}>
              {isLast ? (
                <BreadcrumbPage className="capitalize">{label}</BreadcrumbPage>
              ) : (
                <>
                  <BreadcrumbLink href="#" className="capitalize">
                    {label}
                  </BreadcrumbLink>
                  <BreadcrumbSeparator />
                </>
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default UniversalBreadcrum;