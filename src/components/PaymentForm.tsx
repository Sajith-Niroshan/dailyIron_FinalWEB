import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { CreditCard, Lock } from 'lucide-react';

interface PaymentFormProps {
  amount: number; // Amount in cents
  clientSecret: string;
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (error: string) => void;
  disabled?: boolean;
  onBackClick: () => void;
  backButtonDisabled?: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  clientSecret,
  onPaymentSuccess,
  onPaymentError,
  disabled = false,
  onBackClick,
  backButtonDisabled = false
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements || disabled || isProcessing) {
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required'
      });

      if (error) {
        console.error('Payment confirmation error:', error);
        setPaymentError(error.message || 'Payment failed');
        onPaymentError(error.message || 'Payment failed');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded:', paymentIntent.id);
        onPaymentSuccess(paymentIntent.id);
      } else {
        console.error('Unexpected payment status:', paymentIntent?.status);
        setPaymentError('Payment was not completed');
        onPaymentError('Payment was not completed');
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setPaymentError(errorMessage);
      onPaymentError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatAmount = (amountInCents: number) => {
    return (amountInCents / 100).toFixed(2);
  };

  return (
    <div className="space-y-6">
      {/* Payment Header */}
      <div className="text-center">
        <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-500">
          <CreditCard className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold mb-2" style={{ color: '#2C3E50' }}>
          Secure Payment
        </h3>
        <p className="text-lg" style={{ color: '#2C3E50' }}>
          Total: <span className="font-bold" style={{ color: '#E87461' }}>
            ${formatAmount(amount)} CAD
          </span>
        </p>
      </div>

      {/* Payment Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Element */}
        <div className="p-6 rounded-lg border-2 border-dashed" style={{ borderColor: '#E87461', backgroundColor: '#FFF8F0' }}>
          <div className="flex items-center space-x-2 mb-4">
            <Lock className="w-4 h-4" style={{ color: '#E87461' }} />
            <span className="text-sm font-medium" style={{ color: '#2C3E50' }}>
              Your payment information is secure
            </span>
          </div>
          
          <PaymentElement 
            options={{
              clientSecret,
              layout: 'tabs'
            }}
          />
        </div>

        {/* Error Display */}
        {paymentError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{paymentError}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!stripe || !elements || !clientSecret || disabled || isProcessing}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-300 ${
            (!stripe || !elements || !clientSecret || disabled || isProcessing)
              ? 'opacity-50 cursor-not-allowed bg-gray-400'
              : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 hover:scale-105 hover:shadow-lg'
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span>Processing Payment...</span>
            </div>
          ) : (
            `Pay ${formatAmount(amount)} CAD`
          )}
        </button>
      </form>

      {/* Security Notice */}
      <div className="text-center text-sm opacity-70" style={{ color: '#2C3E50' }}>
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Lock className="w-4 h-4" />
          <span>Secured by Stripe</span>
        </div>
        <p>Your payment information is encrypted and secure</p>
      </div>
    </div>
  );
};

export default PaymentForm;