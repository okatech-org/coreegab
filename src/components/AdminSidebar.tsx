import React from 'react';
import { NavLink } from 'react-router-dom';
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
import { BarChart3, Package, Users, ShoppingBag, Settings, TrendingUp, Home } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';


interface AdminSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function AdminSidebar({ activeView, onViewChange }: AdminSidebarProps) {
  const { state } = useSidebar();
  const { t } = useLanguage();

  const navigationItems = [
    { id: 'overview', title: t('dashboard.admin.overview'), icon: BarChart3 },
    { id: 'analytics', title: t('dashboard.admin.analytics'), icon: TrendingUp },
    { id: 'products', title: t('dashboard.admin.productManagement'), icon: Package },
    { id: 'users', title: t('dashboard.admin.userManagement'), icon: Users },
    { id: 'orders', title: t('dashboard.admin.allOrders'), icon: ShoppingBag },
    { id: 'settings', title: t('dashboard.admin.settings'), icon: Settings },
  ];

  const mainNavItems = [
    { id: 'home', title: t('sidebar.home'), icon: Home, href: '/' },
  ];

  return (
    <Sidebar className={state === "collapsed" ? "w-14" : "w-60"} collapsible="icon">
      <SidebarContent>
        {/* Logo */}
        <div className="mb-6 lg:mb-8 px-2">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/ff7ce1b8-d2a2-4701-acda-806f793d401b.png" 
              alt="COREEGAB Logo" 
              className="w-8 h-8 lg:w-10 lg:h-10"
            />
            {state !== "collapsed" && (
              <span className="text-foreground font-bold text-xl lg:text-2xl">COREEGAB</span>
            )}
          </div>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel>{t('dashboard.admin.navigation')}</SidebarGroupLabel>
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