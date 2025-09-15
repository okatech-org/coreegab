import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  noIndex?: boolean;
}

export const SEO: React.FC<SEOProps> = ({
  title = "COREGAB - Import Corée-Gabon | Votre partenaire import/export",
  description = "Plateforme d'import de produits coréens au Gabon. Véhicules, électronique, électroménager avec calcul automatique des prix transport et douanes.",
  keywords = "import, corée du sud, gabon, véhicules coréens, électronique, électroménager, samsung, hyundai, lg",
  image = "/coregab-accueil.JPG",
  url = "https://coreegab.com",
  type = "website",
  noIndex = false,
}) => {
  const fullTitle = title.includes('COREGAB') ? title : `${title} | COREGAB`;
  const fullUrl = url.startsWith('http') ? url : `https://coreegab.com${url}`;
  const fullImage = image.startsWith('http') ? image : `https://coreegab.com${image}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="COREGAB" />
      
      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="COREGAB" />
      <meta property="og:locale" content="fr_FR" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      
      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Language" content="fr" />
      <meta name="theme-color" content="#2563eb" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://vpxsyxbxbilqyikmyznf.supabase.co" />
      
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "COREGAB",
          "description": description,
          "url": fullUrl,
          "logo": fullImage,
          "sameAs": [
            "https://coreegab.com"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+241-XX-XX-XX-XX",
            "contactType": "customer service",
            "availableLanguage": ["French", "English", "Korean"]
          },
          "areaServed": {
            "@type": "Country",
            "name": "Gabon"
          },
          "knowsAbout": [
            "Import/Export",
            "Korean Products", 
            "Automotive",
            "Electronics",
            "Home Appliances"
          ]
        })}
      </script>
    </Helmet>
  );
};

// Hook pour les meta tags dynamiques
export const useSEO = (seoData: SEOProps) => {
  return <SEO {...seoData} />;
};
