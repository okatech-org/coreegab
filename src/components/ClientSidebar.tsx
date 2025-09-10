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

const navigationItems = [
  { id: 'catalog', title: 'Catalogue', icon: Grid3X3 },
  { id: 'cart', title: 'Mon Panier', icon: ShoppingCart },
  { id: 'orders', title: 'Mes Commandes', icon: Package },
  { id: 'profile', title: 'Mon Profil', icon: User },
  { id: 'support', title: 'Support', icon: MessageCircle },
];

const mainNavItems = [
  { id: 'home', title: 'Accueil', icon: Home, href: '/' },
];

interface ClientSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function ClientSidebar({ activeView, onViewChange }: ClientSidebarProps) {
  const { state } = useSidebar();

  return (
    <Sidebar className={state === "collapsed" ? "w-14" : "w-60"} collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
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