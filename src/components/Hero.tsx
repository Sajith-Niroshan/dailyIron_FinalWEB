import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Truck, Award, Clock, Star, CheckCircle, ArrowRight } from 'lucide-react';

interface HeroProps {
  openCallOptionModal: (phone: string) => void;
}

const Hero: React.FC<HeroProps> = ({ openCallOptionModal }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const phoneNumber = '(778) 743-7737';
  
  // Screen size detection
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  // Word carousel state
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  
  // Define word arrays
  const commonWords = ['Simple', 'Fast', 'Easy']; // Words shown on both mobile and desktop
  const desktopOnlyWords = ['Effortless', 'Reliable']; // Words shown only on desktop
  
  // Conditionally combine words based on screen size
  const words = isMobile ? commonWords : [...commonWords, ...desktopOnlyWords];
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth <= 768;
      if (newIsMobile !== isMobile) {
        setIsMobile(newIsMobile);
        setCurrentWordIndex(0); // Reset to first word when screen size changes
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);
  
  // Cycle through words every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 2500);
    
    return () => clearInterval(interval);
  }, [words.length]); // Add words.length as dependency

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
    // Always show modal for this button, as it's a primary CTA
    openCallOptionModal(phoneNumber);
  };

  return (
    <section className="relative py-8 overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-orange-50/40">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-100/40 to-transparent blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-tr from-orange-100/40 to-transparent blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-r from-blue-50/20 to-orange-50/20 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Main Hero Content */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-orange-200/50 mb-6 shadow-sm">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium text-gray-700">Trusted by 350+ Happy Customers</span>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                Professional Ironing
              </span>
              <br />
              <span className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent">
                Made{' '}
                <span className="word-carousel-container">
                  <span 
                    key={words[currentWordIndex]} 
                    className="word-carousel-word bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent"
                  >
                    {words[currentWordIndex]}
                  </span>
                </span>
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Skip the ironing board. We pick up your clothes, 
              iron them to perfection, and deliver them back 
              fresh and ready to wear.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <button
                onClick={handleGetQuote}
                className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 animated-border-button"
              >
                <span>Get Your FREE Quote</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <a
                href="#"
                onClick={handleCallClick}
                className="px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-800 font-semibold rounded-xl border border-gray-200 hover:bg-white hover:shadow-lg transition-all duration-300"
              >
                Call: {phoneNumber}
              </a>
            </div>
            
            {/* Trust indicators */}
            <div className="hidden md:flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Free Pickup & Delivery</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>24-Hour Express Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>100% Satisfaction Guarantee</span>
              </div>
            </div>
          </div>

          {/* Feature Cards with Background Images */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <img 
                src="/Daily Ironing Delivery copy.png"
                alt="Daily Ironing Service delivery person handing pressed clothes to a customer"
                className="absolute inset-0 w-full h-full object-cover"
                loading="eager"
                width="400"
                height="300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/50 to-gray-900/30"></div>
              
              <div className="relative z-10 p-8 text-white">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Truck className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Convenient Pickup & Delivery
                </h3>
                <p className="text-white/90 leading-relaxed">
                  We come to you! Schedule pickup and delivery at your convenience. 
                  Orders over $35 include free delivery service.
                </p>
                <div className="mt-4 text-sm text-white font-medium">
                  Free delivery over $35 →
                </div>
              </div>
            </div>
            
            <div className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <img 
                src="/Professional Ironing.png"
                alt="Person in floral apron professionally ironing white garment with blue iron"
                className="absolute inset-0 w-full h-full object-cover"
                loading="eager"
                width="400"
                height="300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/50 to-gray-900/30"></div>
              
              <div className="relative z-10 p-8 text-white">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Expert Professional Care
                </h3>
                <p className="text-white/90 leading-relaxed">
                  Our skilled team uses commercial-grade equipment and proven techniques 
                  to deliver crisp, wrinkle-free results every time.
                </p>
                <div className="mt-4 text-sm text-white font-medium">
                  Professional quality guaranteed →
                </div>
              </div>
            </div>
            
            <div className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <img 
                src="/Gemini Generated Image copy.png"
                alt="Person putting freshly ironed clothes into a car for delivery"
                className="absolute inset-0 w-full h-full object-cover"
                loading="eager"
                width="400"
                height="300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/50 to-gray-900/30"></div>
              
              <div className="relative z-10 p-8 text-white">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Fast Turnaround Time
                </h3>
                <p className="text-white/90 leading-relaxed">
                  Standard 48-hour service with 24-hour express options available. 
                  Your clothes, pressed perfectly, on your schedule.
                </p>
                <div className="mt-4 text-sm text-white font-medium">
                  24-hour express available →
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Hero;