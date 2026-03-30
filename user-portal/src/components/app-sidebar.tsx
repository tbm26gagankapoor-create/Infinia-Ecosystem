import * as React from "react"
import { Link } from "react-router-dom"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  RiHome4Line,
  RiRobotLine,
  RiTerminalBoxLine,
  RiKeyLine,
  RiBarChartLine,
  RiBankCardLine,
  RiSettingsLine,
  RiBookOpenLine,
} from "@remixicon/react"

const data = {
  user: {
    name: "Gagan Kapoor",
    email: "gk@infinia.ai",
    avatar: "",
  },
  navMain: [
    {
      title: "Overview",
      url: "/dashboard",
      icon: <RiHome4Line />,
    },
    {
      title: "Models",
      url: "/models",
      icon: <RiRobotLine />,
    },
    {
      title: "Playground",
      url: "/playground",
      icon: <RiTerminalBoxLine />,
    },
    {
      title: "API Keys",
      url: "/api-keys",
      icon: <RiKeyLine />,
    },
  ],
  navAccount: [
    {
      name: "Usage",
      url: "/usage",
      icon: <RiBarChartLine />,
    },
    {
      name: "Billing",
      url: "/billing",
      icon: <RiBankCardLine />,
    },
    {
      name: "Settings",
      url: "/settings",
      icon: <RiSettingsLine />,
    },
    {
      name: "Docs",
      url: "#",
      icon: <RiBookOpenLine />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-black dark:bg-white">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 11h-3.18C14.4 9.84 13.3 9 12 9s-2.4.84-2.82 2H6c-.33 0-2-.1-2-2V8c0-1.83 1.54-2 2-2h10.18C16.6 7.16 17.7 8 19 8a3 3 0 0 0 3-3 3 3 0 0 0-3-3c-1.3 0-2.4.84-2.82 2H6C4.39 4 2 5.06 2 8v1c0 2.94 2.39 4 4 4h3.18c.42 1.16 1.52 2 2.82 2s2.4-.84 2.82-2H18c.33 0 2 .1 2 2v1c0 1.83-1.54 2-2 2H7.82C7.4 16.84 6.3 16 5 16a3 3 0 0 0-3 3 3 3 0 0 0 3 3c1.3 0 2.4-.84 2.82-2H18c1.61 0 4-1.07 4-4v-1c0-2.93-2.39-4-4-4m1-7a1 1 0 0 1 1 1 1 1 0 0 1-1 1 1 1 0 0 1-1-1 1 1 0 0 1 1-1M5 20a1 1 0 0 1-1-1 1 1 0 0 1 1-1 1 1 0 0 1 1 1 1 1 0 0 1-1 1" className="fill-white dark:fill-black" />
                  </svg>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">AI Gateway</span>
                  <span className="truncate text-xs">Infinia Technologies</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain label="Platform" items={data.navMain} />
        <NavProjects projects={data.navAccount} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
