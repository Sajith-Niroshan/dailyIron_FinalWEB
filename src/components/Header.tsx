import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';

interface HeaderProps {
  openCallOptionModal: (phone: string) => void;
}

const Header: React.FC<HeaderProps> = ({ openCallOptionModal }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleCallClick = () => {
    openCallOptionModal('(778) 743-7737');
  };

  const handleGetQuoteClick = () => {
    navigate('/get-a-quote');
    closeMenu();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
            <img
              src="/logo.png"
              alt="Daily Ironing Service"
              className="h-10 w-auto"
              onError={(e) => {
                // Fallback if logo image doesn't exist
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <span className="hidden text-xl font-bold text-gray-900">
              Daily Ironing
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/about-us"
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              About Us
            </Link>
            <Link
              to="/blog"
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              Blog
            </Link>
            <Link
              to="/faq"
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              FAQ
            </Link>
            <button
              onClick={handleCallClick}
              className="flex items-center space-x-1 text-gray-700 hover:text-purple-600 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>(778) 743-7737</span>
            </button>
            <button
              onClick={handleGetQuoteClick}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Get Quote
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-purple-600"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-purple-600 transition-colors"
                onClick={closeMenu}
              >
                Home
              </Link>
              <Link
                to="/about-us"
                className="text-gray-700 hover:text-purple-600 transition-colors"
                onClick={closeMenu}
              >
                About Us
              </Link>
              <Link
                to="/blog"
                className="text-gray-700 hover:text-purple-600 transition-colors"
                onClick={closeMenu}
              >
                Blog
              </Link>
              <Link
                to="/faq"
                className="text-gray-700 hover:text-purple-600 transition-colors"
                onClick={closeMenu}
              >
                FAQ
              </Link>
              <button
                onClick={() => {
                  handleCallClick();
                  closeMenu();
                }}
                className="flex items-center space-x-1 text-gray-700 hover:text-purple-600 transition-colors text-left"
              >
                <Phone className="w-4 h-4" />
                <span>(778) 743-7737</span>
              </button>
              <button
                onClick={handleGetQuoteClick}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors text-left"
              >
                Get Quote
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;