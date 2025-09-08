import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calculator as CalcIcon, CheckCircle, Truck, Clock } from 'lucide-react';
import { usePageMetadata } from '../hooks/usePageMetadata';
import Calculator from '../components/Calculator';
import PromoBanner from '../components/PromoBanner';

interface QuotePageProps {
  onSchedulePickup: (orderDetails: any) => void;
}

const QuotePage: React.FC<QuotePageProps> = ({ onSchedulePickup }) => {
  usePageMetadata({
    title: 'Get Your FREE Quote | Daily Ironing Service - Instant Pricing Calculator',
    description: 'Get an instant quote for professional ironing service with free pickup and delivery in South Surrey, Surrey, Delta, Langley, and White Rock. No signup required.',
    keywords: 'ironing service quote, instant pricing calculator, free pickup delivery quote, South Surrey ironing price, Surrey ironing price, Delta ironing price, Langley ironing price, White Rock ironing price',
    ogImage: '/Untitled (1920 x 780 px) (1).png',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Get Your FREE Quote - Daily Ironing Service",
      "description": "Instant pricing calculator for professional ironing services with free pickup and delivery",
      "url": "https://dailyironing.ca/get-a-quote",
      "mainEntity": {
        "@type": "LocalBusiness",
        "name": "Daily Ironing Service",
        "description": "Professional ironing service with pickup and delivery",
        "telephone": "(778) 743-7737",
        "email": "hello@dailyironing.ca",
        "areaServed": [
          {
            "@type": "City",
            "name": "South Surrey",
            "addressRegion": "BC",
            "addressCountry": "CA"
          },
          {
            "@type": "City",
            "name": "Surrey",
            "addressRegion": "BC",
            "addressCountry": "CA"
          },
          {
            "@type": "City",
            "name": "Delta",
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
        "serviceType": "Professional Ironing Service",
        "priceRange": "$2.50-$25.00"
      }
    }
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="py-8" style={{ backgroundColor: '#FFF8F0' }}>
        <div className="container mx-auto px-4">
          <Link 
            to="/"
            className="inline-flex items-center space-x-2 mb-6 hover:opacity-70 transition-colors"
            style={{ color: '#E87461' }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-500">
              <CalcIcon className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#2C3E50' }}>
              Get Your FREE Quote
            </h1>
            <p className="text-xl" style={{ color: '#2C3E50' }}>
              Calculate the cost of your ironing service instantly. No sign-up required.
            </p>
          </div>
        </div>
      </div>

      {/* Benefits Banner */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="flex items-center justify-center space-x-3">
                <CheckCircle className="w-6 h-6" style={{ color: '#4285F4' }} />
                <div>
                  <div className="font-semibold" style={{ color: '#2C3E50' }}>Instant Pricing</div>
                  <div className="text-sm opacity-70" style={{ color: '#2C3E50' }}>Real-time calculation</div>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <Truck className="w-6 h-6" style={{ color: '#E87461' }} />
                <div>
                  <div className="font-semibold" style={{ color: '#2C3E50' }}>Free Delivery</div>
                  <div className="text-sm opacity-70" style={{ color: '#2C3E50' }}>Orders over $35</div>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <Clock className="w-6 h-6" style={{ color: '#F4A261' }} />
                <div>
                  <div className="font-semibold" style={{ color: '#2C3E50' }}>Fast Service</div>
                  <div className="text-sm opacity-70" style={{ color: '#2C3E50' }}>24-hour express available</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Component */}
      <Calculator onSchedulePickup={onSchedulePickup} />

      {/* Additional Information */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6" style={{ color: '#2C3E50' }}>
              How Our Pricing Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-xl" style={{ backgroundColor: '#FFF8F0' }}>
                <h3 className="text-xl font-semibold mb-3" style={{ color: '#2C3E50' }}>
                  Per-Item Pricing
                </h3>
                <p style={{ color: '#2C3E50' }}>
                  Each garment is priced individually based on complexity and care required. 
                  No hidden fees or surprise charges.
                </p>
              </div>
              <div className="p-6 rounded-xl" style={{ backgroundColor: '#FFF8F0' }}>
                <h3 className="text-xl font-semibold mb-3" style={{ color: '#2C3E50' }}>
                  Express Service
                </h3>
                <p style={{ color: '#2C3E50' }}>
                  Need it fast? Our 24-hour express service adds just $1.00 per item 
                  for same or next-day delivery.
                </p>
              </div>
              <div className="p-6 rounded-xl" style={{ backgroundColor: '#FFF8F0' }}>
                <h3 className="text-xl font-semibold mb-3" style={{ color: '#2C3E50' }}>
                  Free Delivery
                </h3>
                <p style={{ color: '#2C3E50' }}>
                  Orders $35 and above include completely free pickup and delivery 
                  to your door at your convenience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 text-white" style={{ backgroundColor: '#2C3E50' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Questions About Pricing?
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Our team is here to help you understand our services and pricing
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:(778)743-7737"
                className="px-8 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Call: (778) 743-7737
              </a>
              <Link
                to="/faq"
                className="px-8 py-3 rounded-lg font-medium border-2 border-gray-300 text-gray-300 hover:bg-gray-100 hover:text-gray-800 transition-all duration-300 hover:scale-105"
              >
                View FAQ
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default QuotePage;