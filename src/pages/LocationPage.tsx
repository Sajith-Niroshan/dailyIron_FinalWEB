import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { MapPin, Phone, Clock, Star, CheckCircle, Truck, Award } from 'lucide-react';
import { usePageMetadata } from '../hooks/usePageMetadata';

const LocationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  
  const handleGetQuote = () => {
    navigate('/', { state: { scrollToCalculator: true } });
  };
  
  // Extract location ID from the new URL structure
  let locationId: string;
  if (pathname === '/south-surrey-ironing') {
    locationId = 'south-surrey';
  } else if (pathname === '/surrey-ironing') {
    locationId = 'surrey';
  } else if (pathname === '/langley-ironing') {
    locationId = 'langley';
  } else if (pathname === '/delta-ironing') {
    locationId = 'delta';
  } else if (pathname === '/white-rock-ironing') {
    locationId = 'white-rock';
  } else {
    locationId = '';
  }

  const locationData = {
    'south-surrey': {
      name: 'South Surrey',
      title: 'Professional Ironing Service in South Surrey, BC',
      description: 'Serving South Surrey with premium garment care and convenient pickup & delivery service.',
      neighborhoods: [
        'Crescent Beach',
        'Ocean Park', 
        'Grandview Heights',
        'Elgin',
        'Chantrell',
        'Morgan Creek'
      ],
      image: 'https://images.pexels.com/photos/6069112/pexels-photo-6069112.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      features: [
        'Fast 24-hour service available',
        'Free pickup and delivery over $30',
        'Professional pressing and garment care',
        'Serving all South Surrey neighborhoods',
        'Experienced local team',
        'Satisfaction guarantee'
      ],
      testimonials: [
        {
          name: 'Sarah M.',
          location: 'Ocean Park',
          text: 'Amazing service! They picked up my work clothes and had them back perfectly pressed the next day.'
        },
        {
          name: 'David L.',
          location: 'Crescent Beach',
          text: 'Professional and reliable. My shirts have never looked better!'
        }
      ]
    },
    'surrey': {
      name: 'Surrey',
      title: 'Professional Ironing Service in Surrey, BC',
      description: 'Serving Surrey with premium garment care and convenient pickup & delivery service.',
      neighborhoods: [
        'City Centre',
        'Whalley',
        'Guildford',
        'Fleetwood',
        'Newton',
        'Cloverdale'
      ],
      image: 'https://images.pexels.com/photos/6069112/pexels-photo-6069112.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      features: [
        'Comprehensive Surrey city coverage',
        'Fast 24-hour service available',
        'Free pickup and delivery over $30',
        'Professional pressing and garment care',
        'Serving all Surrey neighborhoods',
        'Quality guarantee on all work'
      ],
      testimonials: [
        {
          name: 'Michael T.',
          location: 'City Centre',
          text: 'Excellent service! They cover the whole Surrey area and always deliver on time.'
        },
        {
          name: 'Emma L.',
          location: 'Guildford',
          text: 'Professional quality ironing with great customer service. Highly recommended!'
        }
      ]
    },
    'langley': {
      name: 'Langley',
      title: 'Professional Ironing Service in Langley, BC',
      description: 'Providing Langley residents with expert garment care and hassle-free pickup & delivery.',
      neighborhoods: [
        'Willoughby',
        'Walnut Grove',
        'Murrayville',
        'Brookswood',
        'Fernridge',
        'Yorkson'
      ],
      image: 'https://images.pexels.com/photos/5591663/pexels-photo-5591663.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      features: [
        'Comprehensive Langley coverage',
        'Express 24-hour service available',
        'Professional-grade equipment',
        'Expert ironing methods',
        'Flexible scheduling options',
        'Quality guarantee on all work'
      ],
      testimonials: [
        {
          name: 'Jennifer K.',
          location: 'Willoughby',
          text: 'The convenience is unmatched. They handle all my family\'s ironing needs perfectly.'
        },
        {
          name: 'Mike R.',
          location: 'Walnut Grove',
          text: 'Great attention to detail and always on time. Highly recommend!'
        }
      ]
    },
    'delta': {
      name: 'Delta',
      title: 'Professional Ironing Service in Delta, BC',
      description: 'Providing Delta residents with expert garment care and hassle-free pickup & delivery.',
      neighborhoods: [
        'Ladner',
        'Tsawwassen',
        'North Delta',
        'Annacis Island',
        'Burns Bog',
        'Boundary Bay'
      ],
      image: 'https://images.pexels.com/photos/5591663/pexels-photo-5591663.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      features: [
        'Complete Delta service coverage',
        'Express 24-hour service available',
        'Professional-grade equipment',
        'Expert ironing methods',
        'Flexible scheduling options',
        'Satisfaction guarantee'
      ],
      testimonials: [
        {
          name: 'Patricia K.',
          location: 'Ladner',
          text: 'Amazing service! They make the trip to Delta and always provide excellent results.'
        },
        {
          name: 'James W.',
          location: 'Tsawwassen',
          text: 'Reliable and professional. Perfect for our family\'s weekly ironing needs.'
        }
      ]
    },
    'white-rock': {
      name: 'White Rock',
      title: 'Professional Ironing Service in White Rock, BC',
      description: 'White Rock\'s trusted ironing service with professional care and convenient home pickup.',
      neighborhoods: [
        'White Rock Beach',
        'East Beach',
        'Hillside',
        'West Beach',
        'Centennial Park',
        'Five Corners'
      ],
      image: 'https://images.pexels.com/photos/6069112/pexels-photo-6069112.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      features: [
        'Complete White Rock service area',
        'Beach community specialists',
        'Quick turnaround times',
        'Professional garment handling',
        'Local family-owned business',
        'Competitive pricing'
      ],
      testimonials: [
        {
          name: 'Lisa T.',
          location: 'East Beach',
          text: 'Living by the beach means my clothes need extra care. They always deliver perfect results.'
        },
        {
          name: 'Robert H.',
          location: 'Hillside',
          text: 'Exceptional service and quality. They\'ve been taking care of my business attire for months.'
        }
      ]
    }
  };

  const pageLocation = locationData[locationId as keyof typeof locationData];

  // SEO metadata for location pages
  React.useEffect(() => {
    if (pageLocation) {
      const metadata = {
        title: `${pageLocation.title} | Professional Ironing Service`,
        description: `${pageLocation.description} Expert garment care, 24-hour express service, and free pickup & delivery over $30.`,
        keywords: `ironing service ${pageLocation.name}, garment care ${pageLocation.name}, pickup delivery ${pageLocation.name}, professional ironing BC`,
        ogImage: pageLocation.image,
        structuredData: {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": `Daily Ironing Service - ${pageLocation.name}`,
          "description": pageLocation.description,
          "telephone": "(778) 743-7737",
          "email": "hello@dailyironing.ca",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": pageLocation.name,
            "addressRegion": "BC",
            "addressCountry": "CA"
          },
          "areaServed": {
            "@type": "City",
            "name": pageLocation.name,
            "addressRegion": "BC",
            "addressCountry": "CA"
          },
          "serviceType": "Professional Ironing Service",
          "priceRange": "$2.50-$25.00",
          "openingHours": [
            "Mo-Fr 07:00-19:00",
            "Sa 08:00-18:00",
            "Su 10:00-16:00"
          ],
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": `Ironing Services in ${pageLocation.name}`,
            "itemListElement": pageLocation.features.map(feature => ({
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": feature,
                "description": `Professional ${feature.toLowerCase()} in ${pageLocation.name}`
              }
            }))
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "350"
          }
        }
      };
      
      // Manually update metadata
      document.title = metadata.title;
      
      const updateMetaTag = (name: string, content: string, property?: boolean) => {
        const attribute = property ? 'property' : 'name';
        let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
        
        if (element) {
          element.content = content;
        } else {
          element = document.createElement('meta');
          element.setAttribute(attribute, name);
          element.content = content;
          document.head.appendChild(element);
        }
      };

      updateMetaTag('description', metadata.description);
      updateMetaTag('keywords', metadata.keywords);
      updateMetaTag('og:title', metadata.title, true);
      updateMetaTag('og:description', metadata.description, true);
      updateMetaTag('og:image', metadata.ogImage, true);
      
      // Add structured data
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        existingScript.remove();
      }
      
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(metadata.structuredData);
      document.head.appendChild(script);
    }
  }, [pageLocation]);
  if (!pageLocation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#2C3E50' }}>
            Location Not Found
          </h1>
          <p className="text-xl mb-8" style={{ color: '#2C3E50' }}>
            The location you're looking for doesn't exist.
          </p>
          <Link 
            to="/"
            className="px-6 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-colors"
            style={{ backgroundColor: '#E87461' }}
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden" style={{ backgroundColor: '#FFF8F0' }}>
        <div className="absolute inset-0 z-0">
          <img 
            src={pageLocation.image}
            alt={`Professional ironing service team providing expert garment care in ${pageLocation.name}, BC`}
            className="w-full h-full object-cover opacity-20"
            loading="eager"
            width="1200"
            height="600"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 to-white/70"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <MapPin className="w-8 h-8" style={{ color: '#E87461' }} />
              <h1 className="text-5xl md:text-6xl font-bold" style={{ color: '#2C3E50' }}>
                {pageLocation.title}
              </h1>
            </div>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto" style={{ color: '#2C3E50' }}>
              {pageLocation.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGetQuote}
                className="px-8 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Get Your FREE Quote
              </button>
              <a
                href="tel:(778)743-7737"
                className="px-8 py-3 rounded-lg font-semibold border-2 text-gray-800 border-gray-800 hover:bg-gray-100 transition-all duration-300 hover:scale-105"
              >
                Call Now: (778) 743-7737
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Service Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12" style={{ color: '#2C3E50' }}>
              Why Choose Us in {pageLocation.name}?
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pageLocation.features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: '#E87461' }} />
                  <span className="text-lg" style={{ color: '#2C3E50' }}>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Neighborhoods Served */}
      <section className="py-16" style={{ backgroundColor: '#FFF8F0' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12" style={{ color: '#2C3E50' }}>
              Neighborhoods We Serve in {pageLocation.name}
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pageLocation.neighborhoods.map((neighborhood, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-lg card-hover">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5" style={{ color: '#E87461' }} />
                    <h3 className="text-lg font-semibold" style={{ color: '#2C3E50' }}>
                      {neighborhood}
                    </h3>
                  </div>
                  <p className="mt-2 text-sm" style={{ color: '#2C3E50' }}>
                    Professional ironing service with free pickup & delivery
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12" style={{ color: '#2C3E50' }}>
              What Our {pageLocation.name} Customers Say
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {pageLocation.testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white rounded-xl p-8 shadow-lg border-l-4" style={{ borderLeftColor: '#E87461' }}>
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" style={{ color: '#F4A261' }} />
                    ))}
                  </div>
                  <p className="text-lg mb-4 italic" style={{ color: '#2C3E50' }}>
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#E87461' }}></div>
                    <span className="font-semibold" style={{ color: '#2C3E50' }}>
                      {testimonial.name}
                    </span>
                    <span className="text-sm opacity-70" style={{ color: '#2C3E50' }}>
                      {testimonial.location}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 text-white" style={{ backgroundColor: '#2C3E50' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Experience Professional Ironing in {pageLocation.name}?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join hundreds of satisfied customers in {pageLocation.name} who trust us with their garment care.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="flex items-center justify-center space-x-3">
                <Phone className="w-6 h-6" style={{ color: '#E87461' }} />
                <div>
                  <div className="font-semibold">Call or Text</div>
                  <div className="text-sm opacity-80">(778) 743-7737</div>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <Clock className="w-6 h-6" style={{ color: '#E87461' }} />
                <div>
                  <div className="font-semibold">Quick Service</div>
                  <div className="text-sm opacity-80">24-hour available</div>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <Truck className="w-6 h-6" style={{ color: '#E87461' }} />
                <div>
                  <div className="font-semibold">Free Delivery</div>
                  <div className="text-sm opacity-80">Orders over $30</div>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleGetQuote}
              className="inline-block px-8 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Get Your FREE Quote Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LocationPage;