import React from 'react';
import { Calendar, Truck, Shirt, CheckCircle } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: Calendar,
      title: 'Schedule Pickup',
      description: 'Choose your pickup date and time slot that works best for your schedule.',
      color: '#4285F4'
    },
    {
      icon: Truck,
      title: 'We Pick Up',
      description: 'Our driver arrives at your door to collect your clothes safely and securely.',
      color: '#E87461'
    },
    {
      icon: Shirt,
      title: 'Professional Ironing',
      description: 'We iron your clothes to perfection using commercial-grade equipment.',
      color: '#F4A261'
    },
    {
      icon: CheckCircle,
      title: 'Fresh Delivery',
      description: 'We deliver your freshly pressed clothes back to your door, ready to wear.',
      color: '#4CAF50'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#2C3E50' }}>
              How It <span style={{ color: '#E87461' }}>Works</span>
            </h2>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto" style={{ color: '#2C3E50' }}>
              Getting professionally pressed clothes has never been easier. 
              Our simple 4-step process makes it effortless.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  {/* Step number */}
                  <div 
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full text-white text-sm font-bold flex items-center justify-center"
                    style={{ backgroundColor: step.color }}
                  >
                    {index + 1}
                  </div>
                  
                  {/* Icon */}
                  <div 
                    className="w-20 h-20 rounded-full mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: `${step.color}20` }}
                  >
                    <step.icon 
                      className="w-10 h-10" 
                      style={{ color: step.color }} 
                    />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-3" style={{ color: '#2C3E50' }}>
                  {step.title}
                </h3>
                
                <p className="leading-relaxed" style={{ color: '#2C3E50' }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          {/* Timeline connector for larger screens */}
          <div className="hidden lg:block relative mt-8">
            <div className="absolute top-0 left-0 w-full flex justify-between px-10">
              {steps.slice(0, -1).map((_, index) => (
                <div 
                  key={index}
                  className="flex-1 h-0.5 mx-4 opacity-30"
                  style={{ backgroundColor: '#E87461', marginTop: '-60px' }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;