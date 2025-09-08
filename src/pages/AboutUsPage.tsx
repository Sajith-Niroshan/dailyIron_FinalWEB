import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, Users, Shield, Star, CheckCircle, Award, Clock } from 'lucide-react';
import { usePageMetadata } from '../hooks/usePageMetadata';

const AboutUsPage: React.FC = () => {
  usePageMetadata({
    title: 'About Us | Daily Ironing Service - Professional Ironing with Free Pickup & Delivery',
    description: 'Learn about Daily Ironing Service - your trusted professional ironing service with free pickup and delivery in South Surrey, Surrey, Delta, Langley, and White Rock.',
    keywords: 'about daily ironing service, professional ironing company, pickup delivery ironing, South Surrey ironing, Surrey ironing, Delta ironing, Langley ironing, White Rock ironing',
    ogImage: '/Untitled design (17).png',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Daily Ironing Service",
      "description": "Professional ironing services with free pickup and delivery in South Surrey, Surrey, Delta, Langley, and White Rock",
      "url": "https://dailyironing.ca/about-us",
      "telephone": "(778) 743-7737",
      "email": "hello@dailyironing.ca",
      "address": {
        "@type": "PostalAddress",
        "addressRegion": "BC",
        description: 'No delivery fees on orders over $35'
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
      "priceRange": "$2.50-$25.00",
      "openingHours": [
        "Mo-Fr 07:00-19:00",
        "Sa 08:00-18:00",
        "Su 10:00-16:00"
      ]
    }
  });

  const values = [
    {
      icon: Heart,
      title: 'Passionate Care',
      description: 'We treat every garment as if it were our own, ensuring meticulous attention to detail.'
    },
    {
      icon: Users,
      title: 'Family Team',
      description: 'Our small team brings personal care and attention to every order.'
    },
    {
      icon: Shield,
      title: 'Quality Guarantee',
      description: 'We stand behind our work with a satisfaction guarantee on all services.'
    },
    {
      icon: Star,
      title: 'Excellence Standard',
      description: 'Years of experience have refined our process to deliver exceptional results.'
    }
  ];

  const features = [
    {
      icon: CheckCircle,
      title: 'Serving South Surrey, Surrey, Delta, Langley & White Rock',
      description: 'Complete coverage across multiple communities'
    },
    {
      icon: Clock,
      title: 'Next-day delivery for most orders',
      description: '24-hour express service available when you need it'
    },
    {
      icon: Award,
      title: 'Free pickup and delivery right to your door',
      description: 'No delivery fees on orders over $30'
    },
    {
      icon: Shield,
      title: 'Clothes returned on hangers (folded on request)',
      description: 'Ready to wear or store as you prefer'
    },
    {
      icon: Star,
      title: 'Special care handling for every garment',
      description: 'Professional equipment and techniques'
    },
    {
      icon: Users,
      title: 'Perfect for busy professionals, families, and anyone who values convenience',
      description: 'Save time for what matters most to you'
    }
  ];

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
              <Heart className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#2C3E50' }}>
              About Daily Ironing
            </h1>
            <p className="text-xl" style={{ color: '#2C3E50' }}>
              Professional Ironing Service with Free Pickup & Delivery
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Introduction */}
          <section className="mb-16">
            <div className="prose prose-lg max-w-none blog-content">
              <p className="text-xl leading-relaxed" style={{ color: '#2C3E50' }}>
                At Daily Ironing, we provide professional ironing services with free pickup and delivery in South Surrey, Surrey, Delta, Langley, and White Rock. We make it easy to enjoy perfectly pressed clothes without spending hours behind an ironing board.
              </p>
              
              <p className="text-lg leading-relaxed" style={{ color: '#2C3E50' }}>
                Our service is simple and convenient: <strong>We Pick Up. We Iron. We Deliver.</strong> Every item is professionally ironed, returned on hangers (folded on request), and ready to wear. From shirts, trousers, and dresses to household linens, we handle each piece with care to ensure a crisp, wrinkle-free finish.
              </p>
              
              <p className="text-lg leading-relaxed" style={{ color: '#2C3E50' }}>
                We also offer special care pickup and delivery, collecting your clothes in protective garment covers, shielding them from weather and dust, and ensuring they're handled safely from start to finish.
              </p>
            </div>
          </section>

          {/* Why Choose Daily Ironing */}
          <section className="mb-16">
            <h2 className="text-4xl font-bold mb-8 text-center" style={{ color: '#2C3E50' }}>
              Why Choose Daily Ironing?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4 p-6 rounded-xl" style={{ backgroundColor: '#FFF8F0' }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-r from-orange-500 to-red-500">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: '#2C3E50' }}>
                      {feature.title}
                    </h3>
                    <p style={{ color: '#2C3E50' }}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Our Values */}
          <section className="mb-16">
            <h2 className="text-4xl font-bold mb-12 text-center" style={{ color: '#2C3E50' }}>
              Our Values
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={value.title} className="text-center">
                  <div className="w-16 h-16 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform duration-300">
                    <value.icon className="w-8 h-8 text-orange-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3" style={{ color: '#2C3E50' }}>
                    {value.title}
                  </h3>
                  <p style={{ color: '#2C3E50' }}>
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Commitment to Excellence */}
          <section className="mb-16">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-3xl font-bold mb-6" style={{ color: '#2C3E50' }}>
                    Our Commitment to Excellence
                  </h3>
                  <div className="space-y-4" style={{ color: '#2C3E50' }}>
                    <p>
                      Based right here in your community, Daily Ironing was founded on the principle 
                      that everyone deserves professionally cared-for clothing without the hassle of 
                      traditional dry cleaning.
                    </p>
                    <p>
                      Our personalized approach allows us to deliver consistent, top-tier results. We use 
                      professional-grade techniques to ensure your clothes look their absolute best.
                    </p>
                    <p>
                      From delicate blouses to crisp dress shirts, we handle each piece with the 
                      expertise and care it deserves. Your satisfaction is our top priority.
                    </p>
                    <p>
                      Whether you need your weekly workwear pressed, your special outfits prepared, or your 
                      household linens refreshed, Daily Ironing is your trusted local partner for quality, 
                      speed, and reliability.
                    </p>
                  </div>
                </div>
                
                <div className="relative">
                  <img 
                    src="/Untitled design (17).png"
                    alt="Daily Ironing Service team providing expert garment care with professional pressing equipment"
                    className="w-full h-80 object-cover rounded-xl shadow-lg"
                    loading="lazy"
                    width="600"
                    height="320"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl"></div>
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold">350+</div>
                        <div className="text-sm opacity-90">Happy Customers</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">4.9★</div>
                        <div className="text-sm opacity-90">Average Rating</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">24hr</div>
                        <div className="text-sm opacity-90">Express Service</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center">
            <div className="rounded-2xl p-8 text-white bg-gradient-to-r from-orange-500 to-red-500">
              <h2 className="text-3xl font-bold mb-4">
                Ready for Wrinkle-Free Living?
              </h2>
              <p className="text-xl mb-6 opacity-90">
                Enjoy wrinkle-free clothes without lifting a finger — book your ironing service today and let us do the rest.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/#calculator-section"
                  className="px-8 py-3 bg-white text-gray-800 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105"
                >
                  Get Your FREE Quote
                </Link>
                <a
                  href="tel:(778)743-7737"
                  className="px-8 py-3 bg-white bg-opacity-20 hover:bg-opacity-30 font-semibold rounded-lg transition-all duration-300 hover:scale-105"
                >
                  Call: (778) 743-7737
                </a>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;