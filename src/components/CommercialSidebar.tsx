import React from 'react';
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
import { Plus, Users, ShoppingBag, Calculator, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface CommercialSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function CommercialSidebar({ activeView, onViewChange }: CommercialSidebarProps) {
  const { state } = useSidebar();
  const { t } = useLanguage();

  const navigationItems = [
    { id: 'overview', title: t('dashboard.commercial.overview'), icon: ShoppingBag },
    { id: 'neworder', title: t('dashboard.commercial.newOrder'), icon: Plus },
    { id: 'clients', title: t('dashboard.commercial.myClients'), icon: Users },
    { id: 'orders', title: t('dashboard.commercial.dailyOrders'), icon: ShoppingBag },
    { id: 'commission', title: t('dashboard.commercial.commission'), icon: Calculator },
    { id: 'calendar', title: t('dashboard.commercial.calendar'), icon: Calendar },
  ];

  return (
    <Sidebar className={state === "collapsed" ? "w-14" : "w-60"} collapsible="icon">
      <SidebarContent>
        {/* Logo */}
        <div className="mb-6 lg:mb-8 px-2">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/ff7ce1b8-d2a2-4701-acda-806f793d401b.png" 
              alt="COREGAB Logo" 
              className="w-8 h-8 lg:w-10 lg:h-10"
            />
            {state !== "collapsed" && (
              <span className="text-foreground font-bold text-xl lg:text-2xl">COREGAB</span>
            )}
          </div>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel>{t('dashboard.commercial.navigation')}</SidebarGroupLabel>
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