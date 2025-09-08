import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Gift, Info, X } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { usePageMetadata } from '../hooks/usePageMetadata';
import PaymentForm from '../components/PaymentForm';
import { OrderService } from '../services/orderService';
import { CommunicationService } from '../services/communicationService';
import { CouponService } from '../services/couponService';
import { stripePromise } from '../lib/stripe';

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Payment state
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // Tip state - changed to percentages with 5% default
  const [selectedTip, setSelectedTip] = useState<number>(0);
  const tipOptions = [
    { value: 0, label: 'No Tip' },
    { value: 0.05, label: '5%' },
    { value: 0.10, label: '10%' },
    { value: 0.15, label: '15%' }
  ];

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Set page metadata
  usePageMetadata({
    title: 'Payment | Daily Ironing Service',
    description: 'Complete your payment for professional ironing service with pickup and delivery.',
    keywords: 'payment, ironing service payment, Daily Ironing Service',
    ogImage: '/Untitled (1920 x 780 px) (1).png'
  });

  // Load data from sessionStorage on component mount
  useEffect(() => {
    const currentOrderId = sessionStorage.getItem('currentOrderId');
    const currentCustomerId = sessionStorage.getItem('currentCustomerId');
    
    if (currentOrderId && currentCustomerId) {
      loadOrderFromDatabase(currentOrderId);
    } else {
      console.log('No order ID found in sessionStorage, redirecting to pickup details');
      navigate('/schedule-pickup'); // Redirect to pickup details if no order ID
    }
  }, [navigate]);

  const loadOrderFromDatabase = async (orderId: string) => {
    try {
      console.log('Loading order from database:', orderId);
      
      const result = await OrderService.getOrderById(orderId);
      
      if (result.success && result.order && result.customer) {
        const { order, customer } = result;
        
        // Transform database data into the format PaymentPage expects
        const transformedFormData = {
          fullName: customer.full_name,
          email: customer.email,
          phone: customer.phone,
          addressLine1: customer.address_line1,
          addressLine2: customer.address_line2 || '',
          unitNumber: customer.unit_number || '',
          city: customer.city,
          province: customer.province,
          postalCode: customer.postal_code,
          pickupDate: order.pickup_date,
          pickupTime: order.pickup_time_slot,
          deliveryDate: order.delivery_date,
          deliveryTime: order.delivery_time_slot,
          specialInstructions: order.special_instructions || ''
        };
        
        // For orderDetails, we need to reconstruct the items and pricing
        // Since items aren't created yet for payment_initiated status, 
        // we'll get them from sessionStorage as a fallback
        const savedOrderDetails = sessionStorage.getItem('schedulePickupOrderDetails');
        
        let transformedOrderDetails;
        if (savedOrderDetails) {
          try {
            const parsedOrderDetails = JSON.parse(savedOrderDetails);
            transformedOrderDetails = {
              items: parsedOrderDetails.items,
              is24HourService: order.is_express_service,
              pricing: {
                baseTotal: Number(order.subtotal),
                deliveryFee: Number(order.delivery_fee),
                finalTotal: Number(order.total_amount),
                totalItems: parsedOrderDetails.pricing?.totalItems || 0
              }
            };
          } catch (parseError) {
            console.error('Error parsing saved order details:', parseError);
            throw new Error('Failed to parse order details');
          }
        } else {
          console.error('No saved order details found in sessionStorage');
          throw new Error('Order details not found');
        }
        
        // Store the transformed data for PaymentPage to use
        sessionStorage.setItem('pickupFormData', JSON.stringify(transformedFormData));
        sessionStorage.setItem('paymentOrderDetails', JSON.stringify(transformedOrderDetails));
        
        setFormData(transformedFormData);
        setOrderDetails(transformedOrderDetails);
        
        console.log('Order data loaded successfully from database');
      } else {
        console.error('Failed to load order:', result.error);
        setError('Failed to load order details. Please try again.');
        navigate('/schedule-pickup');
      }
    } catch (err) {
      console.error('Error loading order from database:', err);
      setError('Failed to load order details. Please try again.');
      navigate('/schedule-pickup');
    }
  };

  // Legacy useEffect for backwards compatibility (in case old sessionStorage data exists)
  useEffect(() => {
    const savedFormData = sessionStorage.getItem('pickupFormData');
    const savedOrderDetails = sessionStorage.getItem('paymentOrderDetails');
    
    if (savedFormData && savedOrderDetails && !formData && !orderDetails) {
      try {
        const parsedFormData = JSON.parse(savedFormData);
        const parsedOrderDetails = JSON.parse(savedOrderDetails);
        setFormData(parsedFormData);
        setOrderDetails(parsedOrderDetails);
        console.log('Payment data loaded from legacy sessionStorage');
      } catch (error) {
        console.error('Error parsing payment data from sessionStorage:', error);
        // Don't redirect here as the main loading logic will handle this
      }
    }
  }, [formData, orderDetails, navigate]);

  // Create payment intent when component loads
  useEffect(() => {
    console.log('*** useEffect in PaymentPage triggered. Dependencies:', { 
      hasFormData: !!formData, 
      hasOrderDetails: !!orderDetails, 
      selectedTip: selectedTip,
      appliedCouponId: appliedCoupon?.id || null,
      appliedCouponCode: appliedCoupon?.code || null,
      appliedCouponDiscountAmount: appliedCoupon?.discountAmount || 0
    });
    if (formData && orderDetails) {
      createPaymentIntent();
    }
  }, [formData, orderDetails, selectedTip, appliedCoupon?.id, appliedCoupon?.discountAmount]);

  // Calculate pricing with tip and coupon
  const calculateFinalPricing = () => {
    if (!orderDetails) return { finalTotal: 0, tipAmount: 0, discountAmount: 0 };

    const baseTotal = orderDetails.pricing.baseTotal;
    const deliveryFee = orderDetails.pricing.deliveryFee;
    const subtotalWithDelivery = baseTotal + deliveryFee;
    const tipAmount = subtotalWithDelivery * selectedTip; // Calculate tip as percentage
    const discountAmount = appliedCoupon?.discountAmount || 0;
    
    const finalTotal = Math.max(0, subtotalWithDelivery + tipAmount - discountAmount);
    
    const result = {
      baseTotal,
      deliveryFee,
      tipAmount,
      discountAmount,
      finalTotal,
      subtotalWithDelivery
    };
    
    // DEBUG: Log all pricing calculations
    console.log('=== PAYMENT PAGE PRICING DEBUG ===');
    console.log('baseTotal:', baseTotal);
    console.log('deliveryFee:', deliveryFee);
    console.log('subtotalWithDelivery:', subtotalWithDelivery);
    console.log('selectedTip (as decimal):', selectedTip);
    console.log('tipAmount:', tipAmount);
    console.log('appliedCoupon:', appliedCoupon);
    console.log('discountAmount:', discountAmount);
    console.log('finalTotal:', finalTotal);
    console.log('=================================');
    
    return result;
  };

  const finalPricing = calculateFinalPricing();

  // Handle coupon application
  const handleApplyCoupon = async () => {
    if (!couponCode.trim() || !orderDetails) {
      return;
    }

    setCouponLoading(true);
    setCouponError(null);

    console.log('=== APPLYING COUPON ===');
    console.log('couponCode:', couponCode.trim());
    console.log('subtotalWithDelivery for coupon validation:', finalPricing.subtotalWithDelivery);
    console.log('=======================');

    try {
      const result = await CouponService.validateCoupon(couponCode.trim(), finalPricing.subtotalWithDelivery);
      
      if (result.success && result.coupon && result.discountAmount) {
        console.log('🎉 === COUPON VALIDATION SUCCESS ===');
        console.log('Coupon code:', result.coupon.code);
        console.log('Coupon type:', result.coupon.type);
        console.log('Coupon value:', result.coupon.value);
        console.log('Calculated discount amount:', result.discountAmount);
        console.log('Order total before discount:', finalPricing.subtotalWithDelivery);
        console.log('🎉 ================================');
        
        setAppliedCoupon({
          ...result.coupon,
          discountAmount: result.discountAmount
        });
        setCouponCode('');
        setError(null);
      } else {
        console.log('❌ === COUPON VALIDATION FAILED ===');
        console.log('Error:', result.error);
        console.log('❌ ===============================');
        setCouponError(result.error || 'Invalid coupon code');
      }
    } catch (error) {
      console.error('💥 === COUPON VALIDATION ERROR ===');
      console.error('Error:', error);
      console.error('💥 ===============================');
      setCouponError('Error validating coupon');
      console.error('Coupon validation error:', error);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    console.log('🗑️ === REMOVING COUPON ===');
    console.log('Previous appliedCoupon:', appliedCoupon);
    console.log('🗑️ ======================');
    setAppliedCoupon(null);
    setCouponError(null);
  };

  // Create payment intent
  const createPaymentIntent = async () => {
    console.log('*** Entering createPaymentIntent function ***');
    console.log('*** Current finalPricing:', finalPricing);
    try {
      setLoading(true);
      const amountInCents = Math.round(finalPricing.finalTotal * 100);
      
      console.log('💳 === CREATING PAYMENT INTENT ===');
      console.log('finalPricing object:', finalPricing);
      console.log('finalTotal before conversion:', finalPricing.finalTotal);
      console.log('amountInCents being sent to Stripe:', amountInCents);
      console.log('selectedTip:', selectedTip);
      console.log('appliedCoupon:', appliedCoupon);
      console.log('🔄 Payment Intent being created with amount:', amountInCents, 'cents ($' + (amountInCents/100).toFixed(2) + ')');
      console.log('💳 ===============================');
      
      // Reset existing payment intent state to force recreation
      setClientSecret(null);
      setPaymentIntentId(null);
      
      // Get current order ID for payment intent metadata
      const currentOrderId = sessionStorage.getItem('currentOrderId');
      
      const paymentPayload = {
        amount: amountInCents,
        currency: 'cad',
        metadata: {
          orderId: currentOrderId || 'unknown',
          customerEmail: formData.email,
          customerName: formData.fullName,
          orderItemsSummary: orderDetails.items.map((item: any) => `${item.quantity}x ${item.name}`).join(', '),
          orderValue: finalPricing.finalTotal.toFixed(2),
          expressService: orderDetails.is24HourService ? 'yes' : 'no',
          tipAmount: finalPricing.tipAmount.toFixed(2),
          discountAmount: finalPricing.discountAmount.toFixed(2),
          couponCode: appliedCoupon?.code || 'none',
          baseTotal: finalPricing.baseTotal.toFixed(2),
          deliveryFee: finalPricing.deliveryFee.toFixed(2)
        }
      };
      
      console.log('📦 === PAYMENT INTENT PAYLOAD ===');
      console.log('Full payload being sent:', paymentPayload);
      console.log('📦 ==============================');
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentPayload)
      });

      const result = await response.json();
      
      console.log('✅ === PAYMENT INTENT RESPONSE ===');
      console.log('Response from create-payment-intent:', result);
      console.log('✅ ===============================');

      if (result.success) {
        setClientSecret(result.clientSecret);
        setPaymentIntentId(result.paymentIntentId);
        setPaymentError(null);
        console.log('✅ New Payment Intent created successfully:', result.paymentIntentId, 'for amount:', result.amount, 'cents');
      } else {
        throw new Error(result.error || 'Failed to create payment intent');
      }
    } catch (error) {
      console.error('Payment intent creation error:', error);
      setError('Failed to initialize payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle successful payment
  const handlePaymentSuccess = async (paymentIntentId: string) => {
    setPaymentProcessing(true);
    
    try {
      const orderId = sessionStorage.getItem('currentOrderId');
      const customerId = sessionStorage.getItem('currentCustomerId');
      
      if (!orderId || !customerId) {
        throw new Error('Order ID or Customer ID not found');
      }

      console.log('Finalizing order:', orderId, 'with payment:', paymentIntentId);

      // Finalize the existing order instead of creating a new one
      const orderResult = await OrderService.finalizeOrder(
        orderId,
        paymentIntentId,
        orderDetails.items,
        orderDetails.is24HourService,
        appliedCoupon?.code,
        finalPricing.finalTotal
      );
      
      if (orderResult.success) {
        // Fetch the complete order details to get the generated order_number
        console.log('Fetching complete order details to get order_number...');
        const completeOrderResult = await OrderService.getOrderById(orderId);
        
        if (!completeOrderResult.success || !completeOrderResult.order) {
          console.error('Failed to fetch complete order details:', completeOrderResult.error);
          throw new Error('Failed to retrieve order number');
        }
        
        const orderNumber = completeOrderResult.order.order_number;
        console.log('🎉 Retrieved order_number from database:', orderNumber);
        
        // Send confirmation notifications
        const smsMessage = CommunicationService.generateOrderConfirmationSMS(
          formData.fullName,
          orderNumber, // Use the actual order_number from database
          formData.pickupDate!
        );
        
        const emailContent = CommunicationService.generateOrderConfirmationEmail(
          formData.fullName,
          orderNumber, // Use the actual order_number from database
          {
            pickupDate: formData.pickupDate,
            pickupTime: formData.pickupTime,
            deliveryDate: formData.deliveryDate,
            totalAmount: finalPricing.finalTotal.toFixed(2)
          }
        );

        // Send notifications
        await Promise.all([
          CommunicationService.sendSMS({
            customerId: customerId,
            orderId: orderId,
            phone: formData.phone,
            message: smsMessage
          }),
          CommunicationService.sendEmail({
            customerId: customerId,
            orderId: orderId,
            email: formData.email,
            subject: emailContent.subject,
            html: emailContent.html,
            text: emailContent.text
          })
        ]);

        // Clear sessionStorage
        sessionStorage.removeItem('schedulePickupOrderDetails');
        sessionStorage.removeItem('currentOrderId');
        sessionStorage.removeItem('currentCustomerId');
        
        // Navigate to confirmation page
        navigate('/confirmation', {
          state: {
            submissionData: {
              customerInfo: formData,
              orderDetails: {
                ...orderDetails,
                pricing: finalPricing
              },
              submittedAt: new Date().toISOString(),
              paymentIntentId
            }
          }
        });
      } else {
        throw new Error(orderResult.error || 'Failed to create order');
      }
    } catch (error) {
      console.error('Order creation error:', error);
      setError('Failed to complete order. Please contact us for assistance.');
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handlePaymentError = (errorMessage: string) => {
    setPaymentError(errorMessage);
    setPaymentProcessing(false);
  };

  const handleBackToPickupDetails = () => {
    navigate('/schedule-pickup');
  };

  if (!formData || !orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="py-8" style={{ backgroundColor: '#FFF8F0' }}>
        <div className="container mx-auto px-4">
          <button 
            onClick={handleBackToPickupDetails}
            className="inline-flex items-center space-x-2 mb-6 hover:opacity-70 transition-colors"
            style={{ color: '#E87461' }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Pickup Details</span>
          </button>
          
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#2C3E50' }}>
              Payment & Tip
            </h1>
            <p className="text-xl" style={{ color: '#2C3E50' }}>
              Step 2 of 2: Complete your payment
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-8">
              <div className="flex items-center space-x-2 text-gray-400">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-500 text-white">
                  ✓
                </div>
                <span className="font-medium">Schedule</span>
              </div>
              <div className="w-16 h-0.5 bg-orange-500"></div>
              <div className="flex items-center space-x-2 text-orange-500">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-orange-500 text-white">
                  2
                </div>
                <span className="font-medium">Payment</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Payment Form */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold mb-6" style={{ color: '#2C3E50' }}>
                  Payment & Tip
                </h2>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                )}

                {/* Tip Selection - Styled like the attachment */}
                <div className="mb-8 p-6 rounded-2xl border-2" style={{ borderColor: '#E87461', backgroundColor: '#FFF8F0' }}>
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#2C3E50' }}>
                    Add a Tip for Our Service
                  </h3>
                  <p className="text-base mb-6 opacity-70" style={{ color: '#2C3E50' }}>
                    Show your appreciation for our professional service
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {tipOptions.map((tip) => (
                      <button
                        key={tip.value}
                        onClick={() => {
                          console.log('💰 === TIP SELECTION ===');
                          console.log('Previous tip:', selectedTip);
                          console.log('New tip selected:', tip.value, '(' + tip.label + ')');
                          console.log('💰 =====================');
                          setSelectedTip(tip.value);
                        }}
                        className={`py-4 px-3 rounded-xl font-semibold transition-all duration-300 border-2 text-center ${
                          selectedTip === tip.value
                            ? 'border-orange-500 bg-white shadow-lg transform scale-105'
                            : 'border-gray-200 bg-white hover:border-orange-300 hover:scale-102'
                        }`}
                        style={{ color: selectedTip === tip.value ? '#E87461' : '#2C3E50' }}
                      >
                        <div className="text-lg font-bold">{tip.label}</div>
                        {tip.value > 0 && (
                          <div className="text-sm opacity-70 mt-1">
                            ${(finalPricing.subtotalWithDelivery * tip.value).toFixed(2)}
                          </div>
                        )}
                        {tip.value === 0 && (
                          <div className="text-sm opacity-70 mt-1">
                            $0.00
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  
                  {/* Pricing breakdown below tip buttons */}
                  <div className="mt-6 space-y-2 text-lg">
                    <div className="flex justify-between">
                      <span style={{ color: '#2C3E50' }}>Subtotal after discount:</span>
                      <span className="font-semibold" style={{ color: '#2C3E50' }}>
                        ${(finalPricing.subtotalWithDelivery - finalPricing.discountAmount).toFixed(2)}
                      </span>
                    </div>
                    {selectedTip > 0 && (
                      <div className="flex justify-between">
                        <span style={{ color: '#2C3E50' }}>Tip ({(selectedTip * 100).toFixed(0)}%):</span>
                        <span className="font-semibold" style={{ color: '#E87461' }}>
                          ${finalPricing.tipAmount.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-xl font-bold pt-2 border-t">
                      <span style={{ color: '#2C3E50' }}>Total:</span>
                      <span style={{ color: '#E87461' }}>
                        ${finalPricing.finalTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Coupon Section - Styled like the attachment */}
                <div className="mb-8 p-6 rounded-2xl border-2" style={{ borderColor: '#E87461', backgroundColor: '#FFF8F0' }}>
                  <h3 className="text-xl font-bold mb-6" style={{ color: '#2C3E50' }}>
                    Coupon Code
                  </h3>
                  
                  {!appliedCoupon ? (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="w-full sm:flex-1 px-4 py-3 border-2 rounded-xl focus:ring-2 focus:border-transparent text-lg"
                        style={{ borderColor: '#E87461', '--tw-ring-color': '#E87461' }}
                        placeholder="Enter coupon code"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={!couponCode.trim() || couponLoading}
                        className="w-full sm:w-auto px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 disabled:opacity-50"
                        style={{ backgroundColor: '#E87461' }}
                      >
                        {couponLoading ? 'Applying...' : 'Apply'}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Gift className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="font-medium text-green-800">
                            {appliedCoupon.code} Applied!
                          </div>
                          <div className="text-sm text-green-600">
                            Save ${finalPricing.discountAmount.toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-green-600 hover:text-green-800 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                  
                  {couponError && (
                    <p className="mt-2 text-sm text-red-600">{couponError}</p>
                  )}
                </div>

                {/* Payment Form */}
                {clientSecret && (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <PaymentForm
                      amount={Math.round(finalPricing.finalTotal * 100)}
                      clientSecret={clientSecret}
                      onPaymentSuccess={handlePaymentSuccess}
                      onPaymentError={handlePaymentError}
                      disabled={paymentProcessing}
                      onBackClick={handleBackToPickupDetails}
                      backButtonDisabled={paymentProcessing}
                    />
                  </Elements>
                )}

                {paymentError && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm">{paymentError}</p>
                  </div>
                )}

              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1 order-1 lg:order-2">
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8">
                <h3 className="text-xl font-bold mb-6" style={{ color: '#2C3E50' }}>
                  Order Summary
                </h3>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="font-semibold mb-3" style={{ color: '#2C3E50' }}>Items:</h4>
                    <div className="space-y-2">
                      {orderDetails.items.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between text-sm">
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
                </div>
                
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${finalPricing.baseTotal.toFixed(2)}</span>
                  </div>
                  
                  {finalPricing.deliveryFee > 0 && (
                    <div className="flex justify-between">
                      <span>Delivery Fee:</span>
                      <span>${finalPricing.deliveryFee.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {selectedTip > 0 && (
                    <div className="flex justify-between">
                      <span>Tip ({(selectedTip * 100).toFixed(0)}%):</span>
                      <span>${finalPricing.tipAmount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {finalPricing.discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span>-${finalPricing.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span style={{ color: '#E87461' }}>
                        ${finalPricing.finalTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {finalPricing.subtotalWithDelivery >= 35 && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Info className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        FREE Pickup & Delivery Included!
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;