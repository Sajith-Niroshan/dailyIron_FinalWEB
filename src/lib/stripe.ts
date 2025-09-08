import { loadStripe } from '@stripe/stripe-js';

// Get the publishable key from environment variables
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

console.log('=== STRIPE KEY DEBUG ===');
console.log('VITE_STRIPE_PUBLISHABLE_KEY:', stripePublishableKey);
console.log('Key exists:', !!stripePublishableKey);
console.log('Key length:', stripePublishableKey?.length || 0);
console.log('========================');

if (!stripePublishableKey) {
  console.warn('Stripe publishable key not found. Please add VITE_STRIPE_PUBLISHABLE_KEY to your .env file.');
}

// Initialize Stripe
export const stripePromise = loadStripe(stripePublishableKey || '');

// Stripe configuration
export const stripeOptions = {
  // You can add global Stripe options here
  appearance: {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#E87461',
      colorBackground: '#ffffff',
      colorText: '#2C3E50',
      colorDanger: '#df1b41',
      fontFamily: 'Inter, system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
  },
};