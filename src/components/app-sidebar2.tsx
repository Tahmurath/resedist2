"use client"

import * as React from "react"
import { ArchiveX, Command, File, Inbox, Send, Trash2 } from "lucide-react"

import { NavUser } from "@/components/nav-user"
import { Label } from "@/components/ui/label"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Switch } from "@/components/ui/switch"

import {
  AudioWaveform,
  BookOpen,
  Bot,

  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"

import { TeamSwitcher } from "@/components/team-switcher"
import {
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Playground",
      url: "/admin/departments",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
          items: [
            {
              title: "Departments",
              url: "/admin/departments",
            },
            {
              title: "Admin",
              url: "/admin",
            },
            {
              title: "Panel",
              url: "/admin/panel",
            },

          ]
        },
        {
          title: "Starred",
          url: "#",
          items: [
            {
              title: "History",
              url: "#",
              items: [
                {
                  title: "dfg sdfg",
                  url: "#",
                },
                {
                  title: "dfg df gdf",
                  url: "#",
                },
                {
                  title: "sdf gsdfg",
                  url: "#",
                },

              ]
            },
            {
              title: "Starred",
              url: "#",
            },
            {
              title: "Settings",
              url: "#",
            },
          ],
        },
        {
          title: "Settings",
          url: "#",
          items: [
            {
              title: "History",
              url: "#",
              items: [
                {
                  title: "dfg sdfg",
                  url: "#",
                },
                {
                  title: "dfg df gdf",
                  url: "#",
                },
                {
                  title: "sdf gsdfg",
                  url: "#",
                },

              ]
            },
            {
              title: "Starred",
              url: "#",
            },
            {
              title: "Settings",
              url: "#",
            },
          ],
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
}

export function AppSidebar2({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Note: I'm using state to show active item.
  // IRL you should use the url/router.
  const [activeItem, setActiveItem] = React.useState(data.navMain[0])
  const [mails, setMails] = React.useState(data.navMain[0].items)
  const { setOpen } = useSidebar()

  return (
      <Sidebar
          collapsible="icon"
          className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row"
          {...props}
      >
        {/* This is the first sidebar */}
        {/* We disable collapsible and adjust width to icon. */}
        {/* This will make the sidebar appear as icons. */}
        <Sidebar
            collapsible="none"
            className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r"
        >
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                  <a href="#">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                      <Command className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">Acme Inc</span>
                      <span className="truncate text-xs">Enterprise</span>
                    </div>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent className="px-1.5 md:px-0">
                <SidebarMenu>
                  {data.navMain.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            tooltip={{
                              children: item.title,
                              hidden: false,
                            }}
                            onClick={() => {
                              setActiveItem(item)
                              setMails(
                                  item.items
                              )
                              setOpen(true)
                            }}
                            isActive={activeItem?.title === item.title}
                            className="px-2.5 md:px-2"
                        >
                          <item.icon />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <NavUser user={data.user} />
          </SidebarFooter>
        </Sidebar>

        {/* This is the second sidebar */}
        {/* We disable collapsible and let it fill remaining space */}
        <Sidebar collapsible="none" className="hidden flex-1 md:flex">
          <SidebarHeader className="gap-3.5 border-b p-4">
            <div className="flex w-full items-center justify-between">
              <div className="text-base font-medium text-foreground">
                {activeItem?.title}
              </div>
              <Label className="flex items-center gap-2 text-sm">
                {/*<span>Unreads</span>*/}
                {/*<Switch className="shadow-none" />*/}
              </Label>
            </div>
            <SidebarInput placeholder="Type to search..." />
          </SidebarHeader>
          <SidebarContent>

            <NavMain items={mails} />
          </SidebarContent>
        </Sidebar>
      </Sidebar>
  )
}
