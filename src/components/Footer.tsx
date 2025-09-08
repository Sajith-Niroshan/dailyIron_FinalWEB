import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="text-white py-12" style={{ backgroundColor: '#1a252f' }}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="mb-4">
                <img 
                  src="/Daily_ironing_whitelogo.png" 
                  alt="Daily Ironing Service - Professional ironing with pickup and delivery" 
                  className="h-16 w-auto mb-4 md:h-20"
                />
              </div>
              <p className="opacity-80 mb-6 max-w-md">
                Your trusted ironing service in Surrey, Delta, Langley, and White Rock. We provide expert garment care with convenient pickup and delivery.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 opacity-80">
                  <Phone className="w-4 h-4" />
                  <span>(778) 743-7737</span>
                </div>
                <div className="flex items-center space-x-2 opacity-80">
                  <Mail className="w-4 h-4" />
                  <span>hello@dailyironing.ca</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4">Services</h4>
              <ul className="space-y-2 opacity-80">
                <li>Professional Ironing</li>
                <li>24-Hour Express Service</li>
                <li>Garment Pressing</li>
                <li>Household Items</li>
                <li>Pickup & Delivery</li>
                <li>Quality Guarantee</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4">Service Areas</h4>
              <ul className="space-y-2 opacity-80">
                <li className="flex items-center space-x-2">
                  <MapPin className="w-3 h-3" />
                  <span>Surrey</span>
                </li>
                <li className="flex items-center space-x-2">
                  <MapPin className="w-3 h-3" />
                  <span>South Surrey</span>
                </li>
                <li className="flex items-center space-x-2">
                  <MapPin className="w-3 h-3" />
                  <span>Delta</span>
                </li>
                <li className="flex items-center space-x-2">
                  <MapPin className="w-3 h-3" />
                  <span>Langley</span>
                </li>
                <li className="flex items-center space-x-2">
                  <MapPin className="w-3 h-3" />
                  <span>White Rock</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4">Company</h4>
              <ul className="space-y-2 opacity-80">
                <li>
                  <Link 
                    to="/about-us" 
                    className="link-hover-effect"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/faq" 
                    className="link-hover-effect"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/get-a-quote" 
                    className="link-hover-effect"
                  >
                    Get Quote
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/privacy-policy" 
                    className="link-hover-effect"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/terms-and-conditions" 
                    className="link-hover-effect"
                  >
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <a 
                    href="mailto:legal@dailyironing.ca" 
                    className="link-hover-effect"
                  >
                    Legal Inquiries
                  </a>
                </li>
                <li>
                  <a 
                    href="mailto:hello@dailyironing.ca" 
                    className="link-hover-effect"
                  >
                    Contact Support
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-600 mt-8 pt-8 text-center opacity-70">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
              <p>&copy; 2024 Daily Ironing Service. All rights reserved.</p>
              <div className="flex space-x-4 text-sm">
                <Link to="/privacy-policy" className="link-hover-effect">
                  Privacy
                </Link>
                <span>•</span>
                <Link to="/terms-and-conditions" className="link-hover-effect">
                  Terms
                </Link>
                <span>•</span>
                <span>Professional garment care services in BC</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;