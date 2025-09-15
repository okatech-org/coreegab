import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'fr' | 'ko' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'fr';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

const translations = {
  fr: {
    nav: {
      home: "Accueil",
      shop: "Boutique", 
      services: "Services",
      contact: "Contact",
      login: "Se connecter",
      upgrade: "Upgrade"
    },
    sidebar: {
      main: "Navigation",
      demoAccounts: "Comptes Démo",
      quickStart: "Démarrage Rapide",
      home: "Accueil",
      shop: "Boutique",
      calculator: "Calcul Prix",
      services: "Services",
      contact: "Contact",
      aiSearch: "Recherche IA",
      commercialChat: "Chat Commercial",
      client: "Client",
      commercial: "Commercial",
      admin: "Administrateur",
      mySpace: "Mon Espace",
      myDashboard: "Mon Tableau de Bord",
      myOrders: "Mes Commandes",
      myFavorites: "Mes Favoris",
      myProfile: "Mon Profil",
      commercialDashboard: "Tableau Commercial",
      clients: "Clients",
      orders: "Commandes",
      messages: "Messages",
      adminDashboard: "Tableau Admin",
      users: "Utilisateurs",
      products: "Produits",
      settings: "Paramètres",
      demoClient: "Démo Client",
      demoCommercial: "Démo Commercial",
      demoAdmin: "Démo Admin",
      logout: "Déconnexion"
    },
    hero: {
      title: "Solutions d'importation intelligentes avec",
      subtitle: "COREEGAB",
      description: "Simplifiez vos importations depuis la Corée du Sud avec notre plateforme IA et nos services personnalisés.",
      cta: "Commencer maintenant",
      demo: "Voir la démo"
    },
    calculator: {
      title: "Calculateur de Prix",
      description: "Calculez le coût total de votre importation en temps réel",
      product: "Produit",
      quantity: "Quantité",
      unitPrice: "Prix unitaire",
      weight: "Poids (kg)",
      calculate: "Calculer",
      results: "Résultats",
      productCost: "Coût produit",
      shipping: "Transport",
      customs: "Douanes",
      total: "Total"
    },
    search: {
      title: "Recherche IA",
      description: "Trouvez des produits coréens avec notre IA avancée",
      placeholder: "Rechercher des produits...",
      search: "Rechercher",
      results: "Résultats de recherche",
      noResults: "Aucun résultat trouvé"
    },
    chat: {
      title: "Chat Commercial",
      description: "Discutez avec nos experts commerciaux",
      placeholder: "Tapez votre message...",
      send: "Envoyer"
    },
    dashboard: {
      client: {
        title: "Tableau de Bord Client",
        welcome: "Bienvenue sur votre espace client",
        orders: "Mes Commandes",
        profile: "Mon Profil",
        support: "Support",
        catalog: "Catalogue",
        cart: "Mon Panier",
        navigation: "Navigation"
      },
      commercial: {
        title: "Tableau de Bord Commercial",
        welcome: "Bienvenue sur votre espace commercial",
        leads: "Prospects",
        clients: "Clients",
        revenue: "Chiffre d'affaires",
        overview: "Vue d'ensemble",
        newOrder: "Nouvelle Commande",
        myClients: "Mes Clients",
        dailyOrders: "Commandes du Jour",
        commission: "Calculateur Commission",
        calendar: "Calendrier RDV",
        navigation: "Navigation Commercial"
      },
      admin: {
        title: "Tableau de Bord Admin",
        welcome: "Bienvenue sur votre espace administrateur",
        users: "Utilisateurs",
        analytics: "Analytiques",
        settings: "Paramètres",
        overview: "Vue d'ensemble",
        productManagement: "Gestion Produits",
        userManagement: "Gestion Utilisateurs",
        allOrders: "Toutes les Commandes",
        navigation: "Navigation Admin"
      }
    },
    common: {
      loading: "Chargement...",
      error: "Erreur",
      success: "Succès",
      cancel: "Annuler",
      save: "Sauvegarder",
      delete: "Supprimer",
      edit: "Modifier",
      view: "Voir",
      back: "Retour",
      next: "Suivant",
      previous: "Précédent"
    }
  },
  ko: {
    nav: {
      home: "홈",
      shop: "쇼핑",
      services: "서비스", 
      contact: "연락처",
      login: "로그인",
      upgrade: "업그레이드"
    },
    sidebar: {
      main: "내비게이션",
      demoAccounts: "데모 계정",
      quickStart: "빠른 시작",
      home: "홈",
      shop: "쇼핑",
      calculator: "가격 계산기",
      services: "서비스",
      contact: "연락처",
      aiSearch: "AI 검색",
      commercialChat: "상업 채팅",
      client: "고객",
      commercial: "상업",
      admin: "관리자",
      mySpace: "내 공간",
      myDashboard: "내 대시보드",
      myOrders: "내 주문",
      myFavorites: "내 즐겨찾기",
      myProfile: "내 프로필",
      commercialDashboard: "상업 대시보드",
      clients: "고객",
      orders: "주문",
      messages: "메시지",
      adminDashboard: "관리자 대시보드",
      users: "사용자",
      products: "제품",
      settings: "설정",
      demoClient: "데모 고객",
      demoCommercial: "데모 상업",
      demoAdmin: "데모 관리자",
      logout: "로그아웃"
    },
    hero: {
      title: "지능형 수입 솔루션",
      subtitle: "COREEGAB",
      description: "AI 플랫폼과 맞춤형 서비스로 한국에서의 수입을 간소화하세요.",
      cta: "지금 시작하기",
      demo: "데모 보기"
    },
    calculator: {
      title: "가격 계산기",
      description: "실시간으로 수입 총비용을 계산하세요",
      product: "제품",
      quantity: "수량",
      unitPrice: "단가",
      weight: "무게 (kg)",
      calculate: "계산하기",
      results: "결과",
      productCost: "제품 비용",
      shipping: "배송",
      customs: "관세",
      total: "총계"
    },
    search: {
      title: "AI 검색",
      description: "고급 AI로 한국 제품을 찾아보세요",
      placeholder: "제품 검색...",
      search: "검색",
      results: "검색 결과",
      noResults: "결과가 없습니다"
    },
    chat: {
      title: "상업 채팅",
      description: "상업 전문가와 대화하세요",
      placeholder: "메시지를 입력하세요...",
      send: "보내기"
    },
    dashboard: {
      client: {
        title: "고객 대시보드",
        welcome: "고객 공간에 오신 것을 환영합니다",
        orders: "내 주문",
        profile: "내 프로필",
        support: "지원",
        catalog: "카탈로그",
        cart: "내 장바구니",
        navigation: "내비게이션"
      },
      commercial: {
        title: "상업 대시보드",
        welcome: "상업 공간에 오신 것을 환영합니다",
        leads: "리드",
        clients: "고객",
        revenue: "수익",
        overview: "개요",
        newOrder: "새 주문",
        myClients: "내 고객",
        dailyOrders: "당일 주문",
        commission: "수수료 계산기",
        calendar: "약속 캘린더",
        navigation: "상업 내비게이션"
      },
      admin: {
        title: "관리자 대시보드",
        welcome: "관리자 공간에 오신 것을 환영합니다",
        users: "사용자",
        analytics: "분석",
        settings: "설정",
        overview: "개요",
        productManagement: "제품 관리",
        userManagement: "사용자 관리",
        allOrders: "모든 주문",
        navigation: "관리자 내비게이션"
      }
    },
    common: {
      loading: "로딩 중...",
      error: "오류",
      success: "성공",
      cancel: "취소",
      save: "저장",
      delete: "삭제",
      edit: "편집",
      view: "보기",
      back: "뒤로",
      next: "다음",
      previous: "이전"
    }
  },
  en: {
    nav: {
      home: "Home",
      shop: "Shop",
      services: "Services",
      contact: "Contact", 
      login: "Login",
      upgrade: "Upgrade"
    },
    sidebar: {
      main: "Navigation",
      demoAccounts: "Demo Accounts",
      quickStart: "Quick Start",
      home: "Home",
      shop: "Shop",
      calculator: "Price Calculator",
      services: "Services",
      contact: "Contact",
      aiSearch: "AI Search",
      commercialChat: "Commercial Chat",
      client: "Client",
      commercial: "Commercial",
      admin: "Administrator",
      mySpace: "My Space",
      myDashboard: "My Dashboard",
      myOrders: "My Orders",
      myFavorites: "My Favorites",
      myProfile: "My Profile",
      commercialDashboard: "Commercial Dashboard",
      clients: "Clients",
      orders: "Orders",
      messages: "Messages",
      adminDashboard: "Admin Dashboard",
      users: "Users",
      products: "Products",
      settings: "Settings",
      demoClient: "Demo Client",
      demoCommercial: "Demo Commercial",
      demoAdmin: "Demo Admin",
      logout: "Logout"
    },
    hero: {
      title: "Smart import solutions with",
      subtitle: "COREEGAB",
      description: "Simplify your imports from South Korea with our AI platform and personalized services.",
      cta: "Get started now",
      demo: "View demo"
    },
    calculator: {
      title: "Price Calculator",
      description: "Calculate the total cost of your import in real time",
      product: "Product",
      quantity: "Quantity",
      unitPrice: "Unit price",
      weight: "Weight (kg)",
      calculate: "Calculate",
      results: "Results",
      productCost: "Product cost",
      shipping: "Shipping",
      customs: "Customs",
      total: "Total"
    },
    search: {
      title: "AI Search",
      description: "Find Korean products with our advanced AI",
      placeholder: "Search products...",
      search: "Search",
      results: "Search results",
      noResults: "No results found"
    },
    chat: {
      title: "Commercial Chat",
      description: "Chat with our commercial experts",
      placeholder: "Type your message...",
      send: "Send"
    },
    dashboard: {
      client: {
        title: "Client Dashboard",
        welcome: "Welcome to your client space",
        orders: "My Orders",
        profile: "My Profile",
        support: "Support",
        catalog: "Catalog",
        cart: "My Cart",
        navigation: "Navigation"
      },
      commercial: {
        title: "Commercial Dashboard",
        welcome: "Welcome to your commercial space",
        leads: "Leads",
        clients: "Clients",
        revenue: "Revenue",
        overview: "Overview",
        newOrder: "New Order",
        myClients: "My Clients",
        dailyOrders: "Daily Orders",
        commission: "Commission Calculator",
        calendar: "Appointments Calendar",
        navigation: "Commercial Navigation"
      },
      admin: {
        title: "Admin Dashboard",
        welcome: "Welcome to your administrator space",
        users: "Users",
        analytics: "Analytics",
        settings: "Settings",
        overview: "Overview",
        productManagement: "Product Management",
        userManagement: "User Management",
        allOrders: "All Orders",
        navigation: "Admin Navigation"
      }
    },
    common: {
      loading: "Loading...",
      error: "Error",
      success: "Success",
      cancel: "Cancel",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      view: "View",
      back: "Back",
      next: "Next",
      previous: "Previous"
    }
  }
};