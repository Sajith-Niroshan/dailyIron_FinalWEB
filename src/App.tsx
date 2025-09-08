import React, { lazy, Suspense } from 'react';
import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { usePageMetadata } from './hooks/usePageMetadata';
import Header from './components/Header';
import ScrollToTop from './components/ScrollToTop';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Calculator from './components/Calculator';
import ServiceAreas from './components/ServiceAreas';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FeaturedBlogPosts from './components/FeaturedBlogPosts';
import CallOptionModal from './components/CallOptionModal'; // Import the new modal
import PromoBanner from './components/PromoBanner';
// Lazy-load non-critical pages
const LocationPage = lazy(() => import('./pages/LocationPage'));
const BlogList = lazy(() => import('./pages/BlogList'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const BlogAdmin = lazy(() => import('./pages/BlogAdmin'));
const AboutUsPage = lazy(() => import('./pages/AboutUsPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const QuotePage = lazy(() => import('./pages/QuotePage'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const ConfirmationPage = lazy(() => import('./pages/ConfirmationPage'));
const GoogleAdsLandingPage = lazy(() => import('./pages/GoogleAdsLandingPage'));
const PickupDetailsPage = lazy(() => import('./pages/PickupDetailsPage'));
const PaymentPage = lazy(() => import('./pages/PaymentPage'));
import ChatWidget from './components/ChatWidget';

function App() {
  const navigate = useNavigate();
  const [showCallOptionModal, setShowCallOptionModal] = useState(false); // New state for call modal
  const [callPhoneNumber, setCallPhoneNumber] = useState(''); // New state for phone number
  
  // Handle scroll to calculator when navigating from other pages
  useEffect(() => {
    if (location.state?.scrollToCalculator) {
      // Use a timeout to ensure the DOM is fully rendered
      const timer = setTimeout(() => {
        const calculatorSection = document.querySelector('#calculator-section');
        if (calculatorSection) {
          calculatorSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      
      // Clear the state to prevent repeated scrolling
      window.history.replaceState({}, document.title);
      
      return () => clearTimeout(timer);
    }
  }, [location]);
  
  // Google review pop-up initialization - DISABLED due to fetch errors
  // useEffect(() => {
  //   // Only initialize once
  //   const widgetContainer = document.getElementById("wid_1755211995136");
  //   if (widgetContainer && !widgetContainer.hasChildNodes()) {
  //     const sc = document.createElement("script");
  //     sc.setAttribute("defer", "true");
  //     sc.setAttribute("src", "https://dbwx2z9xa7qt9.cloudfront.net/bundle.js?cachebust=1755211995136");
  //     sc.setAttribute("theme", "light");
  //     sc.setAttribute("footer", "true");
  //     sc.setAttribute("widget-type", "popup");
  //     sc.setAttribute("token", "6896c3103254813537a2bf27");
  //     sc.setAttribute('apiurl', "https://server.onlinereviews.tech/api/v0.0.9");
  //     sc.setAttribute('stats', "true");
  //     sc.setAttribute('addReview', "true");
  //     sc.setAttribute('profile-pic', "true");
  //     sc.setAttribute('review-name', "true");
  //     sc.setAttribute('positive-stars', "false");
  //     sc.setAttribute('wl', "true");
  //     sc.setAttribute('wlndig', "https://go.taptify.com/daily-ironing");
  //     sc.setAttribute('lang', "us");
  //     sc.setAttribute('brandStyle', "%7B%22sidebar_background%22%3A%22%23F1EEFF%22%2C%22sidebar_text%22%3A%22%2327476a%22%2C%22brand_button_text_color%22%3A%22white%22%2C%22brand_main_color%22%3A%22%23B115E1%22%2C%22brand_button_border_radius%22%3A%2220px%22%2C%22brand_sidebar_text_color_opacity%22%3A%22%2327476a1a%22%2C%22brand_button_hover%22%3A%22rgb(191%2C%2047%2C%20236)%22%2C%22brand_button_active%22%3A%22rgb(150%2C%2018%2C%20191)%22%2C%22brand_main_color_opacity%22%3A%22%23B115E1a%22%2C%22brand_font%22%3A%22Montserrat%22%2C%22star_color%22%3A%22%23F2D449%22%2C%22brand_main_background%22%3A%22%23FBF8F6%22%2C%22brand_card_background%22%3A%22white%22%2C%22poweredByLink%22%3A%22https%3A%2F%2Fwww.taptify.com%22%2C%22poweredicon%22%3A%22https%3A%2F%2Frecensioni-io-static-folder.s3.eu-central-1.amazonaws.com%2Fpublic_onlinereviews%2Fapp.taptify.com%2Ftopbar.png%22%7D");
  //     
  //     widgetContainer.appendChild(sc);
  //     console.log('Google review widget script loaded');
  //   }
  // }, []);
  
  // Default SEO metadata for the homepage
  usePageMetadata({
    title: 'Daily Ironing Service | Professional Ironing in South Surrey, Langley & White Rock',
    description: 'Professional ironing service with pickup & delivery in South Surrey, Langley, and White Rock. Expert garment care, 24-hour express service available. Free delivery over $30.',
    keywords: 'ironing service, South Surrey, Langley, White Rock, garment care, pickup delivery, professional ironing, express service, BC',
    ogImage: '/Untitled (1920 x 780 px) (1).png',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Daily Ironing Service",
      "description": "Professional ironing service with pickup and delivery in South Surrey, Langley, and White Rock",
      "url": "https://dailyironing.ca",
      "telephone": "(778) 743-7737",
      "email": "hello@dailyironing.ca",
      "address": {
        "@type": "PostalAddress",
        "addressRegion": "BC",
        "addressCountry": "CA"
      },
      "areaServed": [
        {
          "@type": "City",
          "name": "South Surrey",
          "addressRegion": "BC",
          "addressCountry": "CA"
        },
        {
          "@type": "City",
          "name": "Langley",
          "addressRegion": "BC",
          "addressCountry": "CA"
        },
        {
          "@type": "City",
          "name": "White Rock",
          "addressRegion": "BC",
          "addressCountry": "CA"
        }
      ],
      "serviceType": "Ironing Service",
      "priceRange": "$2.50-$25.00",
      "openingHours": [
        "Mo-Fr 07:00-19:00",
        "Sa 08:00-18:00",
        "Su 10:00-16:00"
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Ironing Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Professional Ironing",
              "description": "Expert garment pressing and care"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "24-Hour Express Service",
              "description": "Fast turnaround ironing service"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Pickup & Delivery",
              "description": "Convenient home pickup and delivery"
            }
          }
        ]
      }
    }
  });

  const handleSchedulePickup = (orderDetails: any) => {
    // Store order details in sessionStorage for the new page
    sessionStorage.setItem('schedulePickupOrderDetails', JSON.stringify(orderDetails));
    // Navigate to the schedule pickup page
    navigate('/schedule-pickup');
  };

  // New functions for call option modal
  const openCallOptionModal = (phone: string) => {
    setCallPhoneNumber(phone);
    setShowCallOptionModal(true);
  };

  const closeCallOptionModal = () => {
    setShowCallOptionModal(false);
    setCallPhoneNumber('');
  };

  // Home page component
  const HomePage = () => (
    <>
      <Hero openCallOptionModal={openCallOptionModal} />
      <Calculator onSchedulePickup={handleSchedulePickup} />
      <HowItWorks />
      <ServiceAreas />
      <FeaturedBlogPosts />
      <Contact openCallOptionModal={openCallOptionModal} />
    </>
  );

  return (
    <div className="min-h-screen">
      <ScrollToTop />
      <PromoBanner />
      <Header openCallOptionModal={openCallOptionModal} />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/google-ads-offer" element={
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <GoogleAdsLandingPage />
          </Suspense>
        } />
        <Route path="/south-surrey-ironing" element={
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <LocationPage />
          </Suspense>
        } />
        <Route path="/white-rock-ironing" element={
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <LocationPage />
          </Suspense>
        } />
        <Route path="/surrey-ironing" element={
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <LocationPage />
          </Suspense>
        } />
        <Route path="/delta-ironing" element={
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <LocationPage />
          </Suspense>
        } />
        <Route path="/langley-ironing" element={
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <LocationPage />
          </Suspense>
        } />
        <Route path="/blog" element={
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <BlogList />
          </Suspense>
        } />
        <Route path="/blog/:slug" element={
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <BlogPost />
          </Suspense>
        } />
        <Route path="/admin/blog" element={
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <BlogAdmin />
          </Suspense>
        } />
        <Route path="/about-us" element={
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <AboutUsPage />
          </Suspense>
        } />
        <Route path="/faq" element={
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <FAQPage />
          </Suspense>
        } />
        <Route path="/get-a-quote" element={
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <QuotePage onSchedulePickup={handleSchedulePickup} />
          </Suspense>
        } />
        <Route path="/privacy-policy" element={
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <PrivacyPolicy />
          </Suspense>
        } />
        <Route path="/terms-and-conditions" element={
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <TermsAndConditions />
          </Suspense>
        } />
        <Route path="/confirmation" element={
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <ConfirmationPage />
          </Suspense>
        } />
        <Route path="/schedule-pickup" element={
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <PickupDetailsPage />
          </Suspense>
        } />
        <Route path="/payment" element={
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <PaymentPage />
          </Suspense>
        } />
      </Routes>
      
      <Footer />
      
      {showCallOptionModal && (
        <CallOptionModal
          phoneNumber={callPhoneNumber}
          onClose={closeCallOptionModal}
        />
      )}
      
      <ChatWidget />
      
      {/* Google Review Pop-up Container */}
      <div id="wid_1755211995136"></div>
    </div>
  );
}

export default App;