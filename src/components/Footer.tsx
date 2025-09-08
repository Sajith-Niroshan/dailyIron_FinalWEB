import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="/Daily_ironing_Favicon1.png" 
                  alt="Daily Ironing Service" 
                  className="w-10 h-10"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div 
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center"
                  style={{ display: 'none' }}
                >
                  <span className="text-white font-bold text-sm">DI</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: '#2C3E50' }}>
                    Daily Ironing
                  </h3>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Professional ironing service with convenient pickup and delivery across the Lower Mainland.
              </p>
              <div className="flex space-x-3">
                <a
                  href="#"
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-70 transition-colors"
                  style={{ backgroundColor: '#E87461' }}
                >
                  <Facebook className="w-4 h-4 text-white" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-70 transition-colors"
                  style={{ backgroundColor: '#E87461' }}
                >
                  <Twitter className="w-4 h-4 text-white" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-70 transition-colors"
                  style={{ backgroundColor: '#E87461' }}
                >
                  <Instagram className="w-4 h-4 text-white" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4" style={{ color: '#2C3E50' }}>
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/" 
                    className="text-gray-600 hover:text-orange-500 transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/about-us" 
                    className="text-gray-600 hover:text-orange-500 transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/get-a-quote" 
                    className="text-gray-600 hover:text-orange-500 transition-colors"
                  >
                    Get Quote
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/faq" 
                    className="text-gray-600 hover:text-orange-500 transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/blog" 
                    className="text-gray-600 hover:text-orange-500 transition-colors"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Service Areas */}
            <div>
              <h4 className="text-lg font-semibold mb-4" style={{ color: '#2C3E50' }}>
                Service Areas
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/south-surrey-ironing" 
                    className="text-gray-600 hover:text-orange-500 transition-colors"
                  >
                    South Surrey
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/surrey-ironing" 
                    className="text-gray-600 hover:text-orange-500 transition-colors"
                  >
                    Surrey
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/delta-ironing" 
                    className="text-gray-600 hover:text-orange-500 transition-colors"
                  >
                    Delta
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/langley-ironing" 
                    className="text-gray-600 hover:text-orange-500 transition-colors"
                  >
                    Langley
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/white-rock-ironing" 
                    className="text-gray-600 hover:text-orange-500 transition-colors"
                  >
                    White Rock
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4" style={{ color: '#2C3E50' }}>
                Contact Us
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4" style={{ color: '#E87461' }} />
                  <a 
                    href="tel:(778)743-7737"
                    className="text-gray-600 hover:text-orange-500 transition-colors"
                  >
                    (778) 743-7737
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4" style={{ color: '#E87461' }} />
                  <a 
                    href="mailto:hello@dailyironing.ca"
                    className="text-gray-600 hover:text-orange-500 transition-colors"
                  >
                    hello@dailyironing.ca
                  </a>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 mt-0.5" style={{ color: '#E87461' }} />
                  <span className="text-gray-600">
                    Serving Lower Mainland,<br />
                    British Columbia
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-600 text-sm">
                © {currentYear} Daily Ironing Service. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link 
                  to="/privacy-policy" 
                  className="text-gray-600 hover:text-orange-500 transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
                <Link 
                  to="/terms-and-conditions" 
                  className="text-gray-600 hover:text-orange-500 transition-colors text-sm"
                >
                  Terms & Conditions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;