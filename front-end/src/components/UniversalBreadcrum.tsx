import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbEntry {
  label: string;
  to?: string;
}

interface UniversalBreadcrumProps {
  labels: (string | BreadcrumbEntry)[];
  className?: string;
}

function normalizeEntry(entry: string | BreadcrumbEntry): BreadcrumbEntry {
  return typeof entry === "string" ? { label: entry } : entry;
}

function UniversalBreadcrum({ labels, className }: UniversalBreadcrumProps) {
  const navigate = useNavigate();
  const entries = labels.map(normalizeEntry);

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {entries.map((entry, i) => {
          const isLast = i === entries.length - 1;
          return (
            <React.Fragment key={i}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="capitalize">{entry.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href="#"
                    className="capitalize cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      if (entry.to) navigate(entry.to);
                    }}
                  >
                    {entry.label}
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