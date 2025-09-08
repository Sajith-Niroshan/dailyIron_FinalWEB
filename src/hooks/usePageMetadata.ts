import { useEffect } from 'react';

interface PageMetadata {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  structuredData?: object;
}

export const usePageMetadata = (metadata: PageMetadata) => {
  useEffect(() => {
    // Update document title
    document.title = metadata.title;

    // Helper function to update or create meta tags
    const updateMetaTag = (name: string, content: string, property?: boolean) => {
      const attribute = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      
      if (element) {
        element.content = content;
      } else {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        element.content = content;
        document.head.appendChild(element);
      }
    };

    // Update basic meta tags
    updateMetaTag('description', metadata.description);
    if (metadata.keywords) {
      updateMetaTag('keywords', metadata.keywords);
    }

    // Update Open Graph tags
    updateMetaTag('og:title', metadata.ogTitle || metadata.title, true);
    updateMetaTag('og:description', metadata.ogDescription || metadata.description, true);
    updateMetaTag('og:type', metadata.ogType || 'website', true);
    updateMetaTag('og:url', metadata.canonicalUrl || window.location.href, true);
    
    if (metadata.ogImage) {
      updateMetaTag('og:image', metadata.ogImage, true);
      updateMetaTag('og:image:alt', metadata.ogTitle || metadata.title, true);
    }

    // Update Twitter Card tags
    updateMetaTag('twitter:card', metadata.twitterCard || 'summary_large_image', true);
    updateMetaTag('twitter:title', metadata.twitterTitle || metadata.title, true);
    updateMetaTag('twitter:description', metadata.twitterDescription || metadata.description, true);
    
    if (metadata.twitterImage) {
      updateMetaTag('twitter:image', metadata.twitterImage, true);
    }

    // Update canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonicalLink) {
      canonicalLink.href = metadata.canonicalUrl || window.location.href;
    } else {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      canonicalLink.href = metadata.canonicalUrl || window.location.href;
      document.head.appendChild(canonicalLink);
    }

    // Add structured data
    if (metadata.structuredData) {
      // Remove existing structured data
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        existingScript.remove();
      }

      // Add new structured data
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(metadata.structuredData);
      document.head.appendChild(script);
    }

    // Cleanup function
    return () => {
      // Note: We don't remove meta tags on cleanup as they should persist
      // until the next page sets new ones
    };
  }, [metadata]);
};