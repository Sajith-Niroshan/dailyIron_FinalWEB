import { useEffect } from 'react';

export interface PageMetadata {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  ogUrl?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  structuredData?: object;
}

export const usePageMetadata = (metadata: PageMetadata) => {
  useEffect(() => {
    // Update document title
    if (metadata.title) {
      document.title = metadata.title;
    }

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

    // Update standard meta tags
    if (metadata.description) {
      updateMetaTag('description', metadata.description);
    }

    if (metadata.keywords) {
      updateMetaTag('keywords', metadata.keywords);
    }

    // Update Open Graph tags
    if (metadata.ogTitle) {
      updateMetaTag('og:title', metadata.ogTitle, true);
    }

    if (metadata.ogDescription) {
      updateMetaTag('og:description', metadata.ogDescription, true);
    }

    if (metadata.ogImage) {
      updateMetaTag('og:image', metadata.ogImage, true);
    }

    if (metadata.ogType) {
      updateMetaTag('og:type', metadata.ogType, true);
    }

    if (metadata.ogUrl) {
      updateMetaTag('og:url', metadata.ogUrl, true);
    }

    // Update Twitter Card tags
    if (metadata.twitterCard) {
      updateMetaTag('twitter:card', metadata.twitterCard);
    }

    if (metadata.twitterTitle) {
      updateMetaTag('twitter:title', metadata.twitterTitle);
    }

    if (metadata.twitterDescription) {
      updateMetaTag('twitter:description', metadata.twitterDescription);
    }

    if (metadata.twitterImage) {
      updateMetaTag('twitter:image', metadata.twitterImage);
    }

    // Add structured data
    if (metadata.structuredData) {
      // Remove existing structured data script if it exists
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
        const structuredDataScript = document.querySelector('script[type="application/ld+json"]');
        if (structuredDataScript) {
          structuredDataScript.remove();
        }
      }
    };
  }, [
    metadata.title,
    metadata.description,
    metadata.keywords,
    metadata.ogTitle,
    metadata.ogDescription,
    metadata.ogImage,
    metadata.ogType,
    metadata.ogUrl,
    metadata.twitterCard,
    metadata.twitterTitle,
    metadata.twitterDescription,
    metadata.twitterImage,
    metadata.structuredData
  ]);
};