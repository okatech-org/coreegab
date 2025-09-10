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

const navigationItems = [
  { id: 'overview', title: 'Vue d\'ensemble', icon: ShoppingBag },
  { id: 'neworder', title: 'Nouvelle Commande', icon: Plus },
  { id: 'clients', title: 'Mes Clients', icon: Users },
  { id: 'orders', title: 'Commandes du Jour', icon: ShoppingBag },
  { id: 'commission', title: 'Calculateur Commission', icon: Calculator },
  { id: 'calendar', title: 'Calendrier RDV', icon: Calendar },
];

interface CommercialSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function CommercialSidebar({ activeView, onViewChange }: CommercialSidebarProps) {
  const { state } = useSidebar();

  return (
    <Sidebar className={state === "collapsed" ? "w-14" : "w-60"} collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation Commercial</SidebarGroupLabel>
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