import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Phone, MapPin, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  openCallOptionModal: (phone: string) => void;
}

const Header: React.FC<HeaderProps> = ({ openCallOptionModal }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const phoneNumber = '(778) 743-7737';

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

  const handleCallClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Only show modal on screens smaller than large (lg) breakpoint
    if (window.innerWidth < 1024) { // Tailwind's 'lg' breakpoint is 1024px
      openCallOptionModal(phoneNumber);
    } else {
      window.location.href = `tel:${phoneNumber.replace(/\D/g, '')}`;
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <img 
                src="/Untitled (120 x 50 px) (120 x 50 px) (240 x 100 px) copy.png"
                alt="Daily Ironing Service - Professional ironing with pickup and delivery in South Surrey, Langley, and White Rock" 
                className="h-12 w-auto lg:h-16"
              />
            </Link>
          </div>
          
          <div className="hidden lg:flex items-center space-x-8">
            <nav className="flex items-center space-x-6">
              <Link 
                to="/" 
                className="text-sm font-medium link-hover-effect"
                style={{ color: '#2C3E50' }}
              >
                Home
              </Link>
              <Link 
                to="/about-us"
                className="text-sm font-medium link-hover-effect"
                style={{ color: '#2C3E50' }}
              >
                About Us
              </Link>
              <Link 
                to="/faq" 
                className="text-sm font-medium link-hover-effect"
                style={{ color: '#2C3E50' }}
              >
                FAQ
              </Link>
              <Link 
                to="/blog" 
                className="text-sm font-medium link-hover-effect"
                style={{ color: '#2C3E50' }}
              >
                Blog
              </Link>
              <Link 
                to="/get-a-quote" 
                className="text-sm font-medium link-hover-effect"
                style={{ color: '#2C3E50' }}
              >
                Get Quote
              </Link>
            </nav>
            <div className="flex items-center space-x-2" style={{ color: '#2C3E50' }}>
              <MapPin className="w-4 h-4 icon-hover" />
              <span className="text-sm">Surrey • Delta • Langley • White Rock</span>
            </div>
            <a href={`tel:${phoneNumber.replace(/\D/g, '')}`} className="flex items-center space-x-2\" style={{ color: '#2C3E50' }}>
              <Phone className="w-4 h-4 icon-hover" />
              <span className="text-sm font-medium">{phoneNumber}</span>
            </a>
            <button
              onClick={handleGetQuote}
              className="px-4 py-2 rounded-lg font-medium text-white button-hover-effect text-sm bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-300 hover:scale-105"
            >
              Get a Free Quote
            </button>
          </div>
          
          {/* Mobile content */}
          <div className="lg:hidden flex items-center space-x-4">
            {/* Mobile contact info and quote button */}
            <div className="flex flex-col items-start space-y-1">
              <div className="flex items-center space-x-1" style={{ color: '#2C3E50' }}>
                <MapPin className="w-3 h-3" />
                <span className="text-xs">Surrey • Delta • Langley • White Rock</span>
              </div>
              <a href="#" onClick={handleCallClick} className="flex items-center space-x-1" style={{ color: '#2C3E50' }}>
                <Phone className="w-3 h-3" />
                <span className="text-xs font-medium">{phoneNumber}</span>
              </a>
            </div>
            
            {/* Mobile Get Quote Button */}
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" style={{ color: '#2C3E50' }} />
            </button>
          </div>
        </div>
      </div>
    </header>
    
    {/* Mobile Navigation Menu */}
    {isMobileMenuOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
        <div className="bg-white h-full w-80 max-w-sm shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b" style={{ backgroundColor: '#FFF8F0' }}>
            <h2 className="text-lg font-bold" style={{ color: '#2C3E50' }}>
              Navigation
            </h2>
            <button
              onClick={closeMobileMenu}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" style={{ color: '#2C3E50' }} />
            </button>
          </div>
          
          {/* Navigation Links */}
          <nav className="p-4">
            <div className="space-y-2">
              <Link 
                to="/" 
                onClick={closeMobileMenu}
                className="block px-4 py-3 rounded-lg font-medium transition-colors hover:bg-gray-100"
                style={{ color: '#2C3E50' }}
              >
                Home
              </Link>
              <Link 
                to="/about-us"
                onClick={closeMobileMenu}
                className="block px-4 py-3 rounded-lg font-medium transition-colors hover:bg-gray-100"
                style={{ color: '#2C3E50' }}
              >
                About Us
              </Link>
              <Link 
                to="/faq"
                onClick={closeMobileMenu}
                className="block px-4 py-3 rounded-lg font-medium transition-colors hover:bg-gray-100"
                style={{ color: '#2C3E50' }}
              >
                FAQ
              </Link>
              <Link 
                to="/blog"
                onClick={closeMobileMenu}
                className="block px-4 py-3 rounded-lg font-medium transition-colors hover:bg-gray-100"
                style={{ color: '#2C3E50' }}
              >
                Blog
              </Link>
              <button
                onClick={() => {
                  handleGetQuote();
                  closeMobileMenu();
                }}
                className="w-full text-left px-4 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-300 mt-4"
              >
                Get a Free Quote
              </button>
            </div>
            
            {/* Contact Info */}
            <div className="mt-8 pt-6 border-t">
              <h3 className="font-semibold mb-3" style={{ color: '#2C3E50' }}>
                Contact Us
              </h3>
              <div className="space-y-2">
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    openCallOptionModal(phoneNumber);
                    closeMobileMenu();
                  }}
                  className="flex items-center space-x-2 text-sm hover:opacity-70 transition-colors"
                  style={{ color: '#2C3E50' }}
                >
                  <Phone className="w-4 h-4" />
                  <span>{phoneNumber}</span>
                </a>
                <div className="flex items-center space-x-2 text-sm" style={{ color: '#2C3E50' }}>
                  <MapPin className="w-4 h-4" />
                  <span>Surrey • Delta • Langley • White Rock</span>
                </div>
              </div>
            </div>
          </nav>
        </div>
        
        {/* Backdrop - clicking outside closes menu */}
        <div 
          className="absolute inset-0 -z-10"
          onClick={closeMobileMenu}
        ></div>
      </div>
    )}
    </>
  );
};

export default Header;