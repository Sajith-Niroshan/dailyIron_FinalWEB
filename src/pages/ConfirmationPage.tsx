import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Phone, Mail, Clock, Truck, Shield, Gift, ArrowLeft } from 'lucide-react';
import { usePageMetadata } from '../hooks/usePageMetadata';

interface LocationState {
  submissionData: {
    customerInfo: any;
    orderDetails: any;
    submittedAt: string;
  };
}

const ConfirmationPage: React.FC = () => {
  const location = useLocation();
  const state = location.state as LocationState;

  // DEBUG: Log what we receive at the confirmation page
  console.log('=== CONFIRMATION PAGE DEBUG ===');
  console.log('Location object:', location);
  console.log('Location.state:', location.state);
  console.log('Parsed state:', state);
  console.log('submissionData exists?', !!state?.submissionData);
  if (state?.submissionData) {
    console.log('submissionData content:', state.submissionData);
    console.log('customerInfo:', state.submissionData.customerInfo);
    console.log('orderDetails:', state.submissionData.orderDetails);
  }
  console.log('==============================');

  usePageMetadata({
    title: 'Order Confirmed | Daily Ironing Service',
    description: 'Your ironing service order has been confirmed. Track your pickup and delivery status with Daily Ironing Service.',
    keywords: 'order confirmation, ironing service order, pickup delivery status'
  });

  if (!state?.submissionData) {
    console.log('=== ORDER NOT FOUND CONDITION TRIGGERED ===');
    console.log('state exists?', !!state);
    console.log('state.submissionData exists?', !!state?.submissionData);
    console.log('This will show the "Order Not Found" page');
    console.log('===============================================');
    
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#2C3E50' }}>
            Order Not Found
          </h1>
          <p className="text-xl mb-8" style={{ color: '#2C3E50' }}>
            We couldn't find your order information.
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

  const { submissionData } = state;
  const { customerInfo, orderDetails } = submissionData;

  const steps = [
    {
      icon: CheckCircle,
      title: 'Confirmation Sent',
      description: 'You will receive pickup confirmation via SMS and email with all order details.',
      status: 'completed',
      timeframe: 'Within 2 minutes'
    },
    {
      icon: Truck,
      title: 'Driver Dispatch',
      description: 'When our driver is dispatched for pickup, you\'ll get an email and SMS notification with pickup time.',
      status: 'pending',
      timeframe: 'Day of pickup'
    },
    {
      icon: Shield,
      title: 'Secure Pickup',
      description: 'Driver will arrive and provide a confirmation code. Please verify this code before handing over your clothes.',
      status: 'pending',
      timeframe: 'At pickup time'
    },
    {
      icon: Clock,
      title: 'Ironing Complete',
      description: 'Once ironing is finished, you\'ll receive delivery timing via email and SMS. Contact us to reschedule if needed.',
      status: 'pending',
      timeframe: 'Next day (or 24hrs for express)'
    },
    {
      icon: Truck,
      title: 'Delivery Dispatch',
      description: 'Our driver will be dispatched with your freshly pressed clothes. You\'ll receive a delivery code.',
      status: 'pending',
      timeframe: 'Day of delivery'
    },
    {
      icon: Gift,
      title: 'Thank You & Reward',
      description: 'After successful delivery, enjoy a 10% coupon code for your next order!',
      status: 'pending',
      timeframe: 'After delivery'
    }
  ];

  const generateOrderNumber = () => {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `DI${date}${random}`;
  };

  const orderNumber = generateOrderNumber();

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
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#2C3E50' }}>
              Order Confirmed!
            </h1>
            <p className="text-xl mb-2" style={{ color: '#2C3E50' }}>
              Thank you {customerInfo.fullName}! Your pickup has been scheduled.
            </p>
            <p className="text-lg opacity-70" style={{ color: '#2C3E50' }}>
              Order #{orderNumber}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-8">
                <h2 className="text-2xl font-bold mb-6" style={{ color: '#2C3E50' }}>
                  Order Summary
                </h2>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: '#2C3E50' }}>Items:</h3>
                    <div className="space-y-1 text-sm">
                      {orderDetails.items.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between">
                          <span>{item.quantity}x {item.name}</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    {orderDetails.is24HourService && (
                      <div className="mt-2 text-sm font-medium" style={{ color: '#E87461' }}>
                        ⚡ 24-Hour Express Service
                      </div>
                    )}
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between mb-2">
                      <span>Subtotal:</span>
                      <span>${orderDetails.pricing.baseTotal.toFixed(2)}</span>
                    </div>
                    {orderDetails.pricing.deliveryFee > 0 && (
                      <div className="flex justify-between mb-2">
                        <span>Delivery Fee:</span>
                        <span>${orderDetails.pricing.deliveryFee.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span style={{ color: '#E87461' }}>
                        ${orderDetails.pricing.finalTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <h3 className="font-semibold mb-1" style={{ color: '#2C3E50' }}>Pickup Details:</h3>
                    <p style={{ color: '#2C3E50' }}>{customerInfo.addressLine1}</p>
                    {customerInfo.unitNumber && (
                      <p style={{ color: '#2C3E50' }}>Unit: {customerInfo.unitNumber}</p>
                    )}
                    <p style={{ color: '#2C3E50' }}>{customerInfo.city}, {customerInfo.province} {customerInfo.postalCode}</p>
                    <p style={{ color: '#2C3E50' }}>
                      {customerInfo.pickupDate && new Date(customerInfo.pickupDate).toLocaleDateString()} - {customerInfo.pickupTime}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-1" style={{ color: '#2C3E50' }}>Contact:</h3>
                    <p style={{ color: '#2C3E50' }}>{customerInfo.phone}</p>
                    <p style={{ color: '#2C3E50' }}>{customerInfo.email}</p>
                  </div>
                </div>

                <div className="mt-8 p-4 rounded-lg" style={{ backgroundColor: '#FFF8F0' }}>
                  {submissionData.paymentIntentId && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="font-semibold text-sm text-green-800">Payment Confirmed</span>
                      </div>
                      <p className="text-sm text-green-700 mt-1">
                        Your payment has been successfully processed. Payment ID: {submissionData.paymentIntentId.slice(-8)}
                      </p>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 mb-2">
                    <Phone className="w-4 h-4" style={{ color: '#E87461' }} />
                    <span className="font-semibold text-sm" style={{ color: '#2C3E50' }}>Need to make changes?</span>
                  </div>
                  <p className="text-sm" style={{ color: '#2C3E50' }}>
                    Call us at <strong>(778) 743-7737</strong> or email <strong>hello@dailyironing.ca</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Process Timeline */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-8" style={{ color: '#2C3E50' }}>
                What Happens Next?
              </h2>
              
              <div className="space-y-8">
                {steps.map((step, index) => (
                  <div key={index} className="relative">
                    {/* Timeline line */}
                    {index < steps.length - 1 && (
                      <div 
                        className="absolute left-8 top-16 w-0.5 h-16 opacity-20"
                        style={{ backgroundColor: '#E87461' }}
                      ></div>
                    )}
                    
                    <div className="flex items-start space-x-6">
                      {/* Step icon */}
                      <div 
                        className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 ${
                          step.status === 'completed' ? 'ring-4 ring-offset-2' : ''
                        }`}
                        style={{ 
                          backgroundColor: step.status === 'completed' ? '#4285F4' : '#E87461',
                          '--tw-ring-color': '#4285F4'
                        }}
                      >
                        <step.icon className="w-8 h-8 text-white" />
                      </div>
                      
                      {/* Step content */}
                      <div className="flex-1">
                        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4" 
                             style={{ borderLeftColor: step.status === 'completed' ? '#4285F4' : '#E87461' }}>
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xl font-bold" style={{ color: '#2C3E50' }}>
                              Step {index + 1}: {step.title}
                            </h3>
                            <span 
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                step.status === 'completed' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-orange-100 text-orange-800'
                              }`}
                            >
                              {step.status === 'completed' ? 'Completed' : 'Upcoming'}
                            </span>
                          </div>
                          
                          <p className="mb-3" style={{ color: '#2C3E50' }}>
                            {step.description}
                          </p>
                          
                          <div className="flex items-center space-x-2 text-sm">
                            <Clock className="w-4 h-4" style={{ color: '#E87461' }} />
                            <span style={{ color: '#2C3E50' }}>
                              <strong>Timeline:</strong> {step.timeframe}
                            </span>
                          </div>
                          
                          {/* Special instructions for certain steps */}
                          {index === 2 && (
                            <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: '#FFF8F0' }}>
                              <div className="flex items-center space-x-2 mb-1">
                                <Shield className="w-4 h-4" style={{ color: '#E87461' }} />
                                <span className="font-semibold text-sm" style={{ color: '#2C3E50' }}>Security Note:</span>
                              </div>
                              <p className="text-sm" style={{ color: '#2C3E50' }}>
                                Always verify the confirmation code before handing over your clothes. This ensures your pickup is secure.
                              </p>
                            </div>
                          )}
                          
                          {index === 5 && (
                            <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: '#FFF8F0' }}>
                              <div className="flex items-center space-x-2 mb-1">
                                <Gift className="w-4 h-4" style={{ color: '#E87461' }} />
                                <span className="font-semibold text-sm" style={{ color: '#2C3E50' }}>Bonus Reward:</span>
                              </div>
                              <p className="text-sm" style={{ color: '#2C3E50' }}>
                                Get 10% off your next order as a thank you for choosing Daily Ironing!
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Communication methods */}
              <div className="mt-12 grid md:grid-cols-2 gap-6">
                <div className="rounded-xl p-6 text-center" style={{ backgroundColor: '#4285F4', color: 'white' }}>
                  <Mail className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Email Updates</h3>
                  <p className="opacity-90">
                    Detailed confirmations and updates sent to {customerInfo.email}
                  </p>
                </div>
                
                <div className="rounded-xl p-6 text-center" style={{ backgroundColor: '#F4A261', color: 'white' }}>
                  <Phone className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">SMS Notifications</h3>
                  <p className="opacity-90">
                    Quick updates and codes sent to {customerInfo.phone}
                  </p>
                </div>
              </div>

              {/* Call to action */}
              <div className="mt-12 text-center rounded-2xl p-8" style={{ backgroundColor: '#2C3E50', color: 'white' }}>
                <h3 className="text-2xl font-bold mb-4">
                  Questions About Your Order?
                </h3>
                <p className="opacity-90 mb-6">
                  Call us at <strong>(778) 743-7737</strong> or email <strong>hello@dailyironing.ca</strong>
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="tel:(778)743-7737"
                    className="px-6 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    Call: (778) 743-7737
                  </a>
                  <a
                    href="mailto:hello@dailyironing.ca"
                    className="px-6 py-3 rounded-lg font-medium border-2 border-gray-300 text-gray-300 hover:bg-gray-100 hover:text-gray-800 transition-all duration-300 hover:scale-105"
                  >
                    Email Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;