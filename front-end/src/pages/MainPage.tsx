import * as React from "react"
import { AppSidebar } from "@/components/ui/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { useState } from "react";

export default function Page() {
  const [orderBy, setOrderBy] = useState("Relevance")
  const [category, setCategory] = useState<string | null>(null)

  return (
    <div className="flex flex-col min-h-svh">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background z-20 w-full">
        <span className="font-semibold">My App</span>
      </header>

      <SidebarProvider>
        <AppSidebar
          className="border-none"
          onOrderByChange={setOrderBy}
          onCategoryChange={setCategory}
        />
        <SidebarInset>
          <div className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">{category ?? "All"}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{orderBy}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              <div className="aspect-video rounded-xl bg-muted/50" />
              <div className="aspect-video rounded-xl bg-muted/50" />
              <div className="aspect-video rounded-xl bg-muted/50" />
            </div>
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}