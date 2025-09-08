import React from 'react';
import { Calendar, Truck, Shirt, CheckCircle, Clock, Star } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: Calendar,
      title: 'Schedule Pickup',
      description: 'Use our online calculator to get an instant quote and schedule a convenient pickup time.',
      details: ['Choose your items', 'Select pickup time', 'Get instant pricing'],
      color: '#4285F4'
    },
    {
      icon: Truck,
      title: 'We Collect',
      description: 'Our team arrives at your door to collect your garments with care and professionalism.',
      details: ['Free pickup over $30', 'Careful handling', 'Receipt provided'],
      color: '#F4A261'
    },
    {
      icon: Shirt,
      title: 'Expert Care',
      description: 'Your clothes receive professional treatment using commercial-grade equipment and techniques.',
      details: ['Professional pressing', 'Quality inspection', 'Careful packaging'],
      color: '#E87461'
    },
    {
      icon: CheckCircle,
      title: 'Fresh Delivery',
      description: 'We deliver your perfectly pressed garments back to your door, ready to wear.',
      details: ['Same-day available', 'Protective packaging', 'Satisfaction guaranteed'],
      color: '#52C41A'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Header with Image */}
          <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
            <div>
              <h2 className="text-5xl font-bold mb-6" style={{ color: '#2C3E50' }}>
                How It Works
              </h2>
              <p className="text-xl" style={{ color: '#2C3E50' }}>
                Getting professional ironing service has never been easier. 
                Our streamlined process ensures your clothes get the care they deserve.
              </p>
            </div>
            <div className="relative">
              <img 
                src="/Untitled (1920 x 780 px) copy.png"
                alt="Step-by-step ironing service process showing pickup, professional pressing, and delivery in BC"
                className="w-full h-80 object-cover rounded-2xl shadow-xl"
                loading="lazy"
                width="800"
                height="320"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-1">Expert Ironing Service</h3>
                  <p className="text-sm opacity-90">Professional steam pressing for crisp, wrinkle-free results</p>
                </div>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-orange-400 via-red-400 to-green-500 opacity-30"></div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div key={step.title} className="relative">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 lg:relative lg:top-0 lg:left-0 lg:transform-none lg:mb-6">
                    <div 
                      className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg mx-auto relative z-10 float-animation ${
                        index === 0 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                        index === 1 ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                        index === 2 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                        'bg-gradient-to-r from-green-500 to-emerald-600'
                      } hover:scale-110 transition-transform duration-300`}
                    >
                      <step.icon className="w-8 h-8 icon-hover" />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded-full shadow-sm">
                      <span className="text-xs font-bold" style={{ color: step.color }}>
                        {index + 1}
                      </span>
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg card-hover mt-8 lg:mt-0 border-t-4" style={{ borderTopColor: step.color }}>
                    <h3 className="text-xl font-bold mb-3 text-center" style={{ color: '#2C3E50' }}>
                      {step.title}
                    </h3>
                    <p className="text-center mb-4" style={{ color: '#2C3E50' }}>
                      {step.description}
                    </p>
                    
                    {/* Details List */}
                    <div className="space-y-2">
                      {step.details.map((detail, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <div 
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: step.color }}
                          ></div>
                          <span className="text-sm" style={{ color: '#2C3E50' }}>
                            {detail === 'Professional pressing' ? 'Professional ironing' : 
                             detail === 'Same-day available' ? 'Fast 24-hour service' : detail}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA Section */}
          <div className="mt-16 rounded-2xl p-8 text-center" style={{ backgroundColor: '#FFF8F0' }}>
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Star className="w-8 h-8" style={{ color: '#E87461' }} />
                <h3 className="text-3xl font-bold" style={{ color: '#2C3E50' }}>
                  Ready to Experience the Difference?
                </h3>
                <Star className="w-8 h-8" style={{ color: '#E87461' }} />
              </div>
              
              <p className="text-lg mb-6" style={{ color: '#2C3E50' }}>
                Join hundreds of satisfied customers who trust us with their garment care. 
                Professional results, convenient service, and unbeatable value.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center space-x-2 text-sm" style={{ color: '#2C3E50' }}>
                  <Clock className="w-4 h-4" style={{ color: '#E87461' }} />
                  <span>Fast 24-hour service option available</span>
                </div>
                <div className="flex items-center space-x-2 text-sm" style={{ color: '#2C3E50' }}>
                  <Truck className="w-4 h-4" style={{ color: '#E87461' }} />
                  <span>Free pickup & delivery over $35</span>
                </div>
                <div className="flex items-center space-x-2 text-sm" style={{ color: '#2C3E50' }}>
                  <CheckCircle className="w-4 h-4" style={{ color: '#E87461' }} />
                  <span>Satisfaction guaranteed</span>
                </div>
              </div>
              
              <button 
                className="mt-6 px-8 py-3 rounded-lg font-semibold text-white hover:opacity-90 transition-colors shadow-lg"
                className="mt-6 px-8 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                onClick={() => {
                  const calculatorSection = document.querySelector('#calculator-section');
                  calculatorSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Get Your FREE Quote Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;