/// <reference types="vite/client" />

// Global gtag function for Google Ads conversion tracking
declare global {
  function gtag(...args: any[]): void;
}