import { 
  Home,
  ShoppingCart, 
  MessageSquare, 
  Package, 
  Warehouse,
  DollarSign,
  Users,
  Mail,
  TrendingUp,
  ClipboardList
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

const wholesalerNavigation = [
  // Part 1 - Core Operations
  { title: "Aperçu", url: "/dashboard/wholesaler", icon: Home },
  { title: "Commandes", url: "/dashboard/wholesaler/orders", icon: ShoppingCart },
  { title: "RFQ & Devis", url: "/dashboard/wholesaler/rfqs", icon: MessageSquare },
  { title: "Catalogue Produits", url: "/dashboard/wholesaler/products", icon: Package },
  { title: "Inventaire", url: "/dashboard/wholesaler/inventory", icon: Warehouse },
  
  // Part 2 - Advanced Features
  { title: "Tarification", url: "/dashboard/wholesaler/pricing", icon: DollarSign },
  { title: "Clients & CRM", url: "/dashboard/wholesaler/customers", icon: Users },
  { title: "Messagerie", url: "/dashboard/wholesaler/messaging", icon: Mail },
];

export function WholesalerSidebar() {
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
            <TrendingUp className="h-6 w-6 text-primary" />
            {!isCollapsed && (
              <span className="font-bold text-lg text-primary">Fournisseur Hub</span>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Opérations Principales</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {wholesalerNavigation.slice(0, 5).map((item) => (
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

        <SidebarGroup>
          <SidebarGroupLabel>Fonctionnalités Avancées</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {wholesalerNavigation.slice(5).map((item) => (
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