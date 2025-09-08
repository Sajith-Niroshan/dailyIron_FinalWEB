import React from 'react';
import { CalendarCheck, Truck, Shirt, Home } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: CalendarCheck,
      title: 'Schedule Pickup',
      description: 'Choose a convenient date and time for us to collect your items. Our online booking is quick and easy.',
      color: '#E87461'
    },
    {
      icon: Truck,
      title: 'We Pick Up',
      description: 'Our friendly driver will arrive at your doorstep to collect your clean, dry clothes. We handle them with care.',
      color: '#4285F4'
    },
    {
      icon: Shirt,
      title: 'Professional Ironing',
      description: 'Your garments are hand-ironed by our experts using commercial-grade equipment for a crisp, wrinkle-free finish.',
      color: '#F4A261'
    },
    {
      icon: Home,
      title: 'Fresh Delivery',
      description: 'We deliver your perfectly pressed clothes back to you, folded or on hangers, ready to wear.',
      color: '#2C3E50'
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#2C3E50' }}>
            How It <span style={{ color: '#E87461' }}>Works</span>
          </h2>
          <p className="text-xl text-gray-600">
            Our simple 4-step process makes professional ironing effortless.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Timeline line for larger screens */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 transform -translate-y-1/2"></div>

          {steps.map((step, index) => (
            <div 
              key={index} 
              className="relative z-10 bg-white rounded-2xl shadow-lg p-8 text-center card-hover border border-gray-100"
            >
              {/* Step Number Badge */}
              <div 
                className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-lg border-4 border-white"
                style={{ backgroundColor: step.color }}
              >
                {index + 1}
              </div>

              {/* Icon */}
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 mt-4"
                style={{ backgroundColor: `${step.color}1A` }} // Light background for icon
              >
                <step.icon className="w-10 h-10" style={{ color: step.color }} />
              </div>

              <h3 className="text-xl font-bold mb-3" style={{ color: '#2C3E50' }}>
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;