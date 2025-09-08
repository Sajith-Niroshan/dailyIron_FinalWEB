import React from 'react';
import { MapPin, CheckCircle, Clock, Truck } from 'lucide-react';

const ServiceAreas: React.FC = () => {
  const serviceAreas = [
    {
      name: 'South Surrey',
      coverage: 'Full Coverage',
      features: ['Free Pickup & Delivery', '24-Hour Express Available', 'Same-Day Service'],
      color: '#E87461'
    },
    {
      name: 'Surrey',
      coverage: 'Full Coverage',
      features: ['Free Pickup & Delivery', '24-Hour Express Available', 'Same-Day Service'],
      color: '#4285F4'
    },
    {
      name: 'Delta',
      coverage: 'Full Coverage',
      features: ['Free Pickup & Delivery', '24-Hour Express Available', 'Same-Day Service'],
      color: '#F4A261'
    },
    {
      name: 'Langley',
      coverage: 'Full Coverage',
      features: ['Free Pickup & Delivery', '24-Hour Express Available', 'Same-Day Service'],
      color: '#2C3E50'
    },
    {
      name: 'White Rock',
      coverage: 'Full Coverage',
      features: ['Free Pickup & Delivery', '24-Hour Express Available', 'Same-Day Service'],
      color: '#E87461'
    }
  ];

  return (
    <section className="py-16" style={{ backgroundColor: '#FFF8F0' }}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-500">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#2C3E50' }}>
              Service <span style={{ color: '#E87461' }}>Areas</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We proudly serve the Lower Mainland with professional ironing services, 
              convenient pickup & delivery, and express options.
            </p>
          </div>

          {/* Service Areas Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {serviceAreas.map((area, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl shadow-lg p-6 card-hover border-l-4"
                style={{ borderLeftColor: area.color }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${area.color}1A` }}
                  >
                    <MapPin className="w-6 h-6" style={{ color: area.color }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: '#2C3E50' }}>
                      {area.name}
                    </h3>
                    <p className="text-sm font-medium" style={{ color: area.color }}>
                      {area.coverage}
                    </p>
                  </div>
                </div>
                
                <ul className="space-y-2">
                  {area.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm" style={{ color: '#2C3E50' }}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Service Information */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#4285F41A' }}>
                <Truck className="w-8 h-8" style={{ color: '#4285F4' }} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#2C3E50' }}>
                Free Delivery
              </h3>
              <p className="text-gray-600">
                Orders over $35 include completely free pickup and delivery service to your door.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#E874611A' }}>
                <Clock className="w-8 h-8" style={{ color: '#E87461' }} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#2C3E50' }}>
                Express Service
              </h3>
              <p className="text-gray-600">
                24-hour express service available for just $1.00 extra per item when you need it fast.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#F4A2611A' }}>
                <MapPin className="w-8 h-8" style={{ color: '#F4A261' }} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#2C3E50' }}>
                Growing Coverage
              </h3>
              <p className="text-gray-600">
                We're expanding our service areas. Contact us if you're nearby but don't see your area listed.
              </p>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="mt-12 text-center bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold mb-4" style={{ color: '#2C3E50' }}>
              Don't See Your Area?
            </h3>
            <p className="text-lg mb-6" style={{ color: '#2C3E50' }}>
              We're always looking to expand our service areas. Get in touch to see if we can serve you!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:(778)743-7737"
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Call: (778) 743-7737
              </a>
              <a
                href="mailto:hello@dailyironing.ca"
                className="px-8 py-3 border-2 font-semibold rounded-lg transition-all duration-300 hover:scale-105"
                style={{ borderColor: '#2C3E50', color: '#2C3E50' }}
              >
                Email Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceAreas;