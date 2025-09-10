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
  MessageSquare,
  Settings,
  Phone
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
    { title: t('sidebar.services'), url: "/#services", icon: Settings },
    { title: t('sidebar.contact'), url: "/#contact", icon: Phone },
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
  const getNavCls = ({ isActive }: { isActive: boolean }) => {
    if (isActive) {
      return "bg-sidebar-accent text-sidebar-primary font-medium border-l-2 border-sidebar-primary";
    } else {
      return "text-sidebar-foreground hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground";
    }
  };

  return (
    <Sidebar className={`${collapsed ? "w-14" : "w-60"} sidebar-nav`} collapsible="icon" side="left">
      <SidebarContent className="p-2 lg:p-4">
        {/* Logo */}
        <div className="mb-6 lg:mb-8 px-2">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/ff7ce1b8-d2a2-4701-acda-806f793d401b.png" 
              alt="COREGAB Logo" 
              className="w-8 h-8 lg:w-10 lg:h-10"
            />
            {!collapsed && (
              <span className="text-foreground font-bold text-xl lg:text-2xl">COREGAB</span>
            )}
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
                    {item.url.includes('#') ? (
                      <a 
                        href={item.url}
                        className={`${getNavCls({ isActive: isActive("/") })} flex items-center`}
                      >
                        <item.icon className="w-5 h-5 mr-3" />
                        {!collapsed && <span>{item.title}</span>}
                      </a>
                    ) : (
                      <NavLink 
                        to={item.url} 
                        end 
                        className={getNavCls}
                      >
                        <item.icon className="w-5 h-5 mr-3" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    )}
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