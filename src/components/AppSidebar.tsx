import { useState } from "react";
import { 
  Building2, 
  Users, 
  Package, 
  FileText, 
  Receipt, 
  CreditCard, 
  ShoppingCart, 
  BarChart3,
  FolderOpen,
  HeadphonesIcon,
  Settings,
  Home,
  Calculator
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Clients/Fournisseurs", url: "/contacts", icon: Users },
  { title: "Catalogue", url: "/products", icon: Package },
  { title: "Devis", url: "/quotes", icon: FileText },
  { title: "Factures", url: "/invoices", icon: Receipt },
  { title: "Avoirs", url: "/credit-notes", icon: Calculator },
  { title: "Achats", url: "/purchases", icon: ShoppingCart },
  { title: "Paiements", url: "/payments", icon: CreditCard },
  { title: "Projets", url: "/projects", icon: FolderOpen },
  { title: "Rapports", url: "/reports", icon: BarChart3 },
  { title: "Support", url: "/support", icon: HeadphonesIcon },
  { title: "Paramètres", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "hover:bg-sidebar-accent/50";

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar
      className={isCollapsed ? "w-14" : "w-60"}
      collapsible="icon"
    >
      <SidebarContent>
        <div className="p-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            {!isCollapsed && (
              <span className="font-bold text-lg text-primary">Business Manager</span>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}