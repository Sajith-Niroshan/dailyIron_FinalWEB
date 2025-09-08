import { supabase } from '../lib/supabase';

export interface Coupon {
  id: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  min_order_amount: number;
  usage_limit?: number;
  used_count: number;
  expires_at?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CouponValidationResult {
  success: boolean;
  coupon?: Coupon;
  discountAmount?: number;
  error?: string;
}

export class CouponService {
  static async validateCoupon(code: string, orderTotal: number): Promise<CouponValidationResult> {
    try {
      console.log('Validating coupon:', code, 'for order total:', orderTotal);
      
      // Check if Supabase is properly configured
      if (!import.meta.env.VITE_SUPABASE_URL || 
          import.meta.env.VITE_SUPABASE_URL === 'your_supabase_project_url') {
        console.warn('Supabase not configured, cannot validate coupon');
        return { success: false, error: 'Coupon validation not available' };
      }

      const { data: coupon, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.error('Error fetching coupon:', error);
        return { success: false, error: 'Error validating coupon' };
      }

      if (!coupon) {
        return { success: false, error: 'Invalid coupon code' };
      }

      // Check if coupon has expired
      if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
        return { success: false, error: 'Coupon has expired' };
      }

      // Check if usage limit has been reached
      if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
        return { success: false, error: 'Coupon usage limit reached' };
      }

      // Check minimum order amount
      if (orderTotal < coupon.min_order_amount) {
        return { 
          success: false, 
          error: `Minimum order amount of $${coupon.min_order_amount.toFixed(2)} required` 
        };
      }

      // Calculate discount
      let discountAmount = 0;
      if (coupon.type === 'percentage') {
        discountAmount = Math.min(orderTotal * (coupon.value / 100), orderTotal);
      } else if (coupon.type === 'fixed') {
        discountAmount = Math.min(coupon.value, orderTotal);
      }

      return {
        success: true,
        coupon,
        discountAmount: Math.round(discountAmount * 100) / 100 // Round to 2 decimal places
      };
    } catch (error) {
      console.error('Error in validateCoupon:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  static async incrementCouponUsage(couponId: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Incrementing coupon usage for:', couponId);
      
      // Check if Supabase is properly configured
      if (!import.meta.env.VITE_SUPABASE_URL || 
          import.meta.env.VITE_SUPABASE_URL === 'your_supabase_project_url') {
        console.warn('Supabase not configured, cannot increment coupon usage');
        return { success: false, error: 'Database not configured' };
      }

      // Use RPC call to increment coupon usage through database function
      const { error } = await supabase
        .rpc('increment_coupon_used_count', { 
          coupon_id: couponId 
        });

      if (error) {
        console.error('Error incrementing coupon usage:', error);
        return { success: false, error: error.message };
      }

      console.log('Coupon usage incremented successfully');
      return { success: true };
    } catch (error) {
      console.error('Error in incrementCouponUsage:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}