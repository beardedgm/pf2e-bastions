import { Home, Book, Castle, Calculator, Calendar, Shield } from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Documentation",
    url: "/docs",
    icon: Book,
  },
  {
    title: "Builder",
    url: "/builder",
    icon: Castle,
  },
  {
    title: "Calculator",
    url: "/calculator",
    icon: Calculator,
  },
  {
    title: "Tracker",
    url: "/tracker",
    icon: Calendar,
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer hover-elevate rounded-lg px-2 py-2">
            <Shield className="h-6 w-6 text-primary" />
            <div className="flex flex-col">
              <span className="font-serif font-bold text-sm">Bastion Explorer</span>
              <span className="text-xs text-muted-foreground">PF2e v2.1</span>
            </div>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive} data-testid={`nav-${item.title.toLowerCase()}`}>
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="text-xs text-muted-foreground text-center">
          <div className="font-semibold">Pathfinder 2e</div>
          <div>Bastion System Explorer</div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
