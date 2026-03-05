"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "@/context/UserContext"
import Link from "next/link"

const data = {

  navMain: [
   
    {
      title: "Invoices",
      url: "/invoices",
      icon: IconFileDescription,
    },
    {
      title: "New Invoice",
      url: "/invoices/new",
      icon: IconListDetails,
    },
    {
      title: "Payments",
      url: "/invoices/payments",
      icon: IconChartBar,
    },
  ],


 
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
 
  const { user } = useAuth();
  const userdata = {
    user: {
      id: user?.id || "",
      username: user?.username || "",
      email: user?.email || "",
      avatar: "/avatars/shadcn.jpg",
    },
  }


  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="#">
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavDocuments  />
        <NavSecondary  className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userdata.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
