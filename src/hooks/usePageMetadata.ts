import { useEffect } from 'react';

interface PageMetadata {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  ogUrl?: string;
  structuredData?: object;
}

export function usePageMetadata(metadata: PageMetadata) {
  useEffect(() => {
    // Update document title
    if (metadata.title) {
      document.title = metadata.title;
    }

    // Helper function to update or create meta tags
    const updateMetaTag = (name: string, content: string, property?: boolean) => {
      if (!content) return;
      
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

    // Update standard meta tags
    updateMetaTag('description', metadata.description || '');
    updateMetaTag('keywords', metadata.keywords || '');

    // Update Open Graph tags
    updateMetaTag('og:title', metadata.ogTitle || metadata.title || '', true);
    updateMetaTag('og:description', metadata.ogDescription || metadata.description || '', true);
    updateMetaTag('og:image', metadata.ogImage || '', true);
    updateMetaTag('og:type', metadata.ogType || 'website', true);
    updateMetaTag('og:url', metadata.ogUrl || window.location.href, true);

    // Update Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', metadata.ogTitle || metadata.title || '');
    updateMetaTag('twitter:description', metadata.ogDescription || metadata.description || '');
    updateMetaTag('twitter:image', metadata.ogImage || '');

    // Handle structured data
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

    // Cleanup function to remove structured data when component unmounts
    return () => {
      if (metadata.structuredData) {
        const existingScript = document.querySelector('script[type="application/ld+json"]');
        if (existingScript) {
          existingScript.remove();
        }
      }
    };
  }, [metadata]);
}