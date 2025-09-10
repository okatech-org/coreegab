import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
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

// Moved to component to use translations

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;
  const { t } = useLanguage();

  const mainItems = [
    { title: t('sidebar.home'), url: "/", icon: Home },
    { title: t('sidebar.shop'), url: "/boutique", icon: ShoppingBag },
    { title: t('sidebar.calculator'), url: "/calculator", icon: CreditCard },
  ];

  const demoItems = [
    { title: t('sidebar.client'), url: "/client-dashboard", icon: Users },
    { title: t('sidebar.commercial'), url: "/commercial-dashboard", icon: MessageSquare },
    { title: t('sidebar.admin'), url: "/admin-dashboard", icon: Box },
  ];

  const quickStarts = [
    { title: t('sidebar.search'), url: "/search", icon: Zap },
    { title: t('sidebar.chat'), url: "/chat", icon: MessageSquare },
  ];

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-sidebar-accent text-sidebar-primary font-medium border-l-2 border-sidebar-primary" 
      : "text-sidebar-foreground hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground";

  return (
    <Sidebar className={`${collapsed ? "w-14" : "w-60"} sidebar-nav`} collapsible="icon" side="left">
      <SidebarContent className="p-2 lg:p-4">
        {/* Logo */}
        <div className="mb-6 lg:mb-8 px-2">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 lg:w-8 lg:h-8 bg-sidebar-foreground rounded-lg flex items-center justify-center">
              <span className="text-sidebar-background font-bold text-base lg:text-lg">C</span>
            </div>
            {!collapsed && <span className="text-sidebar-foreground font-bold text-lg lg:text-xl">COREGAB</span>}
          </div>
        </div>

        {/* Main Navigation */}
        <SidebarGroup className="mb-6">
          <SidebarGroupLabel className="text-sidebar-foreground/70 text-xs font-semibold uppercase tracking-wider mb-3 px-2">
            {!collapsed && t('sidebar.main')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="rounded-lg">
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
          <SidebarGroupLabel className="text-sidebar-foreground/70 text-xs font-semibold uppercase tracking-wider mb-3 px-2">
            {!collapsed && t('sidebar.demo')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {demoItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="rounded-lg">
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
          <SidebarGroupLabel className="text-sidebar-foreground/70 text-xs font-semibold uppercase tracking-wider mb-3 px-2">
            {!collapsed && t('sidebar.quickStart')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {quickStarts.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="rounded-lg">
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