import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Phone, Calculator } from 'lucide-react';

interface HeaderProps {
  openCallOptionModal: (phone: string) => void;
}

const Header: React.FC<HeaderProps> = ({ openCallOptionModal }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const phoneNumber = '(778) 743-7737';

  const handleCallClick = (e: React.MouseEvent) => {
    e.preventDefault();
    openCallOptionModal(phoneNumber);
  };

  const handleGetQuote = () => {
    navigate('/get-a-quote');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            onClick={closeMenu}
          >
            <img 
              src="/Daily_ironing_Favicon1.png" 
              alt="Daily Ironing Service" 
              className="logo-responsive"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <div 
              className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center"
              style={{ display: 'none' }}
            >
              <span className="text-white font-bold text-xl">DI</span>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold" style={{ color: '#2C3E50' }}>
                Daily Ironing
              </h1>
              <p className="text-sm text-gray-600 hidden md:block">Professional Service</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-orange-500 font-medium transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/about-us" 
              className="text-gray-700 hover:text-orange-500 font-medium transition-colors"
            >
              About Us
            </Link>
            <Link 
              to="/blog" 
              className="text-gray-700 hover:text-orange-500 font-medium transition-colors"
            >
              Blog
            </Link>
            <Link 
              to="/faq" 
              className="text-gray-700 hover:text-orange-500 font-medium transition-colors"
            >
              FAQ
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="#"
              onClick={handleCallClick}
              className="flex items-center space-x-2 text-gray-700 hover:text-orange-500 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="font-medium">{phoneNumber}</span>
            </a>
            
            <button
              onClick={handleGetQuote}
              className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center space-x-2"
            >
              <Calculator className="w-4 h-4" />
              <span>Get Quote</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <nav className="py-4 space-y-2">
              <Link 
                to="/" 
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-orange-500 font-medium transition-colors rounded-lg"
                onClick={closeMenu}
              >
                Home
              </Link>
              <Link 
                to="/about-us" 
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-orange-500 font-medium transition-colors rounded-lg"
                onClick={closeMenu}
              >
                About Us
              </Link>
              <Link 
                to="/blog" 
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-orange-500 font-medium transition-colors rounded-lg"
                onClick={closeMenu}
              >
                Blog
              </Link>
              <Link 
                to="/faq" 
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-orange-500 font-medium transition-colors rounded-lg"
                onClick={closeMenu}
              >
                FAQ
              </Link>
              
              <div className="pt-2 mt-2 border-t space-y-2">
                <a
                  href="#"
                  onClick={(e) => {
                    handleCallClick(e);
                    closeMenu();
                  }}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-orange-500 transition-colors rounded-lg"
                >
                  <Phone className="w-4 h-4" />
                  <span className="font-medium">{phoneNumber}</span>
                </a>
                
                <button
                  onClick={() => {
                    handleGetQuote();
                    closeMenu();
                  }}
                  className="w-full mx-4 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Calculator className="w-4 h-4" />
                  <span>Get Quote</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;