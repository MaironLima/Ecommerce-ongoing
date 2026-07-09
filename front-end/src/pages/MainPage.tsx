import { AppSidebar } from "@/components/ui/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import publicAPI from "@/services/api/publicApi";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface Posts {
  id: string;
  title: string;
  description: string;
  basePrice: number;
  mainImage: string;
  createdAt: string;
}

export default function Page() {
  const [orderBy, setOrderBy] = useState("Relevance");
  const [category, setCategory] = useState<string | null>(null);

const { data: postData } = useQuery<Posts[]>({
  queryKey: ["posts"],
  queryFn: async () => {
    const response = await publicAPI.get("/products", {
      params: { sort: 'price', page: 2 }
    });
    const results: Posts[] = response.data?.results ?? [];
    return results;
  },
});

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
              {postData?.length ? (
                postData.map((post: Posts) => (
                  <div key={post.id} className="aspect-video rounded-xl bg-muted/50 flex flex-col items-center justify-center p-4">
                    <img src={post.mainImage} alt={post.title} className="h-24 object-cover rounded mb-2" />
                    <span className="text-primary font-bold">{post.title}</span>
                    <span className="text-sm">{post.description}</span>
                    <span className="text-primary font-semibold mt-2">R$ {post.basePrice}</span>
                  </div>
                ))
              ) : (
                <span>Nenhum post encontrado.</span>
              )}
            </div>
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
