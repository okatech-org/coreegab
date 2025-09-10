import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
} from '@/components/ui/sidebar';
import { ShoppingCart, Package, User, MessageCircle, Grid3X3, Home } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';


interface ClientSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function ClientSidebar({ activeView, onViewChange }: ClientSidebarProps) {
  const { state } = useSidebar();
  const { t } = useLanguage();

  const navigationItems = [
    { id: 'catalog', title: t('dashboard.client.catalog'), icon: Grid3X3 },
    { id: 'cart', title: t('dashboard.client.cart'), icon: ShoppingCart },
    { id: 'orders', title: t('dashboard.client.orders'), icon: Package },
    { id: 'profile', title: t('dashboard.client.profile'), icon: User },
    { id: 'support', title: t('dashboard.client.support'), icon: MessageCircle },
  ];

  const mainNavItems = [
    { id: 'home', title: t('sidebar.home'), icon: Home, href: '/' },
  ];

  return (
    <Sidebar className={state === "collapsed" ? "w-14" : "w-60"} collapsible="icon">
      <SidebarContent>
        {/* Logo */}
        <div className="mb-6 lg:mb-8 px-2">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/ff7ce1b8-d2a2-4701-acda-806f793d401b.png" 
              alt="COREGAB Logo" 
              className="w-7 h-7 lg:w-8 lg:h-8"
            />
            {state !== "collapsed" && (
              <img 
                src="/lovable-uploads/14b3cf89-5c77-491d-97f3-9d8f19ebe034.png" 
                alt="COREGAB" 
                className="h-6 lg:h-7 w-auto"
              />
            )}
          </div>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>{t('dashboard.client.navigation')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.href} className="cursor-pointer hover:bg-muted/50">
                      <item.icon className="w-4 h-4" />
                      {state !== "collapsed" && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => onViewChange(item.id)}
                    className={`cursor-pointer ${
                      activeView === item.id 
                        ? 'bg-primary text-primary-foreground font-medium' 
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {state !== "collapsed" && <span>{item.title}</span>}
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