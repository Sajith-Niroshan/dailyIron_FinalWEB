import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tag } from 'lucide-react';
import { Banner } from './ui/banner';

const PromoBanner: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed the banner
    const isDismissed = localStorage.getItem('fb20-promo-dismissed');
    const dismissedAt = localStorage.getItem('fb20-promo-dismissed-at');
    
    // If dismissed, check if it was more than 7 days ago
    if (isDismissed && dismissedAt) {
      const dismissedDate = new Date(dismissedAt);
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      
      if (dismissedDate < sevenDaysAgo) {
        // Reset the dismissal if it's been more than 7 days
        localStorage.removeItem('fb20-promo-dismissed');
        localStorage.removeItem('fb20-promo-dismissed-at');
        setShowBanner(true);
      }
    } else if (!isDismissed) {
      setShowBanner(true);
    }
  }, []);

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('fb20-promo-dismissed', 'true');
    localStorage.setItem('fb20-promo-dismissed-at', new Date().toISOString());
  };

  const handleGetQuote = () => {
    // If already on home page, scroll directly to calculator
    if (location.pathname === '/') {
      const calculatorSection = document.querySelector('#calculator-section');
      if (calculatorSection) {
        calculatorSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If on different page, navigate to home with scroll state
      navigate('/', { state: { scrollToCalculator: true } });
    }
  };

  // Only show on home page and get-a-quote page
  const shouldShowOnCurrentPage = location.pathname === '/' || location.pathname === '/get-a-quote';

  if (!shouldShowOnCurrentPage) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <Banner
        show={showBanner}
        onHide={handleDismiss}
        icon={<Tag className="m-px h-4 w-4 text-green-800" />}
        title={
          <>
            🎉 <span className="font-semibold">New Customer Special:</span> Get{' '}
            <span className="font-bold text-green-800">20% OFF</span> your first order! Use code{' '}
            <span className="font-mono font-bold bg-green-200/50 px-1 py-0.5 rounded text-green-900">FB20</span> at checkout.
          </>
        }
      />
    </div>
  );
};

export default PromoBanner;