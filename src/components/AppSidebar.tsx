import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Video, 
  Image, 
  Edit, 
  Palette, 
  Box, 
  Zap, 
  Menu,
  ShoppingBag,
  CreditCard,
  MessageSquare
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Accueil", url: "/", icon: Home },
  { title: "Boutique", url: "/boutique", icon: ShoppingBag },
  { title: "Calcul Prix", url: "/calculator", icon: CreditCard },
];

const demoItems = [
  { title: "Client", url: "/client-dashboard", icon: Users },
  { title: "Commercial", url: "/commercial-dashboard", icon: MessageSquare },
  { title: "Admin", url: "/admin-dashboard", icon: Box },
];

const quickStarts = [
  { title: "Recherche IA", url: "/search", icon: Zap },
  { title: "Chat Commercial", url: "/chat", icon: MessageSquare },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-sidebar-accent text-sidebar-primary font-medium" 
      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground";

  return (
    <Sidebar className={`${collapsed ? "w-14" : "w-60"} sidebar-nav`} collapsible="icon">
      <SidebarContent className="p-4">
        {/* Logo */}
        <div className="mb-8">
          <div className="openart-logo">
            <Box className="w-6 h-6 text-primary" />
            {!collapsed && <span>COREGAB</span>}
          </div>
        </div>

        {/* Main Navigation */}
        <SidebarGroup className="mb-6">
          <SidebarGroupLabel className="text-sidebar-foreground text-sm font-medium mb-3">
            {!collapsed && "Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavCls}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Demo Accounts */}
        <SidebarGroup className="mb-6">
          <SidebarGroupLabel className="text-sidebar-foreground text-sm font-medium mb-3">
            {!collapsed && "Comptes Démo"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {demoItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={getNavCls}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Starts */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground text-sm font-medium mb-3">
            {!collapsed && "Quick starts"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {quickStarts.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={getNavCls}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {!collapsed && <span>{item.title}</span>}
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