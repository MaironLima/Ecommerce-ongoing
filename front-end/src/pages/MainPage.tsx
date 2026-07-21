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
import { useStore } from "@/stores/store";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Posts {
  id: string;
  title: string;
  description: string;
  base_price: number;
  main_image: string;
}

export default function Page() {
  const [orderBy, setOrderBy] = useState("Relevance");
  const [page, setPage] = useState(1);
  const { appName, order, category, setCategory } = useStore();

  const navigate = useNavigate();

  const { data: posts = [], refetch } = useQuery<Posts[]>({
    queryKey: ["posts", category, order, page],
    queryFn: async () => {
      const response = await publicAPI.get("/products", {
        params: { sort: order, page: page, category: category || "all" },
      });
      const results: Posts[] =
        response.data?.results ?? response.data?.rows ?? [];
      return results;
    },
  });

  useEffect(() => {
    refetch();
  }, [category]);

  function onClickHandle(id: string) {
    navigate(`/product/${id}`)
  }

  return (
    <div className="flex flex-col min-h-svh">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background z-20 w-full">
        <span className="font-semibold">{appName}</span>
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

          <div className="flex flex-1 flex-col gap-4 p-4 ">
            <div
              className="cursor-pointer grid auto-rows-min gap-4 grid-cols-[repeat(auto-fill,minmax(230px,1fr))]"
            >
              {posts?.length ? (
                posts.map((post: Posts) => (
                  <div
                    key={post.id}
                    onClick={() => onClickHandle(post.id)}
                    className="min-h-[300px] max-h-[300px] w-full rounded-xl bg-muted/50 flex flex-col justify-center p-4 global-card-hover overflow-hidden group"
                  >
                    <img
                      src={`${publicAPI.defaults.baseURL}/uploads?path=${encodeURIComponent(post.main_image)}`}
                      crossOrigin="anonymous"
                      alt={post.title}
                      className="h-[165px] object-cover rounded mb-2 transition-transform duration-300 group-hover:scale-105"
                    />
                    <span
                      className="capitalize text-[14px]"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        wordBreak: "break-word",
                      }}
                    >
                      {post.title}
                    </span>
                    <span className="font-semibold mt-auto text-[16px] self-start">
                      R$ {post.base_price}
                    </span>
                  </div>
                ))
              ) : (
                <span>No post founds.</span>
              )}
            </div>
            {/* <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" /> */}
          </div>
        </SidebarInset>
      </SidebarProvider>

      <div className="bg-red-500">
        <button onClick={() => setPage((pages) => pages + 1)}>{page}</button>
      </div>
    </div>
  );
}