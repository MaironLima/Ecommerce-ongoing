import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import publicAPI from "@/services/api/publicApi"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react";

const defaultOrderBy = [
  { title: "Relevance", url: "#" },
  { title: "Ascending price", url: "#" },
  { title: "Descending price", url: "#" },
]

interface CategoryItem {
  title: string
  url: string
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  onOrderByChange?: (title: string) => void
  onCategoryChange?: (title: string) => void
}

export function AppSidebar({ onOrderByChange, onCategoryChange, ...props }: AppSidebarProps) {
  const [activeOrderBy, setActiveOrderBy] = useState("Relevance")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const handleOrderByClick = (title: string) => {
    setActiveOrderBy(title)
    onOrderByChange?.(title)
  }

  const handleCategoryClick = (title: string) => {
    setActiveCategory(title)
    onCategoryChange?.(title)
  }

  const { data: categories = [] } = useQuery<CategoryItem[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await publicAPI.get("/catalog/category")
      const results: { id: string; name: string }[] =
        response.data?.results ?? []
      return results.map((cat) => ({
        title: cat.name,
        url: "#",
      }))
    },
  })

  // substitui o onSuccess removido no React Query v5
  React.useEffect(() => {
    if (categories.length > 0 && activeCategory === null) {
      setActiveCategory(categories[0].title)
      onCategoryChange?.(categories[0].title)
    }
  }, [categories])

  return (
    <Sidebar collapsible="none" {...props}>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Order by</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {defaultOrderBy.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={activeOrderBy === item.title}
                    onClick={() => handleOrderByClick(item.title)}
                  >
                    <a href={item.url} onClick={(e) => e.preventDefault()}>
                      {item.title}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Categorys</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {categories.map((item: CategoryItem) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={activeCategory === item.title}
                    onClick={() => handleCategoryClick(item.title)}
                  >
                    <a href={item.url} onClick={(e) => e.preventDefault()}>
                      {item.title}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}