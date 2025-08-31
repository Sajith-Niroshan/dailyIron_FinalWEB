import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Function to test if Supabase is accessible
const testSupabaseConnection = async (client: any) => {
  try {
    // Try a simple query to test connection
    const { error } = await client.from('chat_sessions').select('id').limit(1);
    return !error;
  } catch (e) {
    return false;
  }
};
let supabase: any;
let isSupabaseAccessible = false;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your_supabase_project_url' || supabaseAnonKey === 'your_supabase_anon_key') {
  console.warn('Supabase environment variables are not properly configured. Using mock client.');
  // Create a mock client that won't cause errors but also won't work
  supabase = {
    from: () => ({
      select: () => ({
        order: () => ({
          eq: () => Promise.resolve({ data: [], error: null }),
          neq: () => Promise.resolve({ data: [], error: null }),
          gt: () => Promise.resolve({ data: [], error: null }),
          gte: () => Promise.resolve({ data: [], error: null }),
          lt: () => Promise.resolve({ data: [], error: null }),
          lte: () => Promise.resolve({ data: [], error: null }),
          like: () => Promise.resolve({ data: [], error: null }),
          ilike: () => Promise.resolve({ data: [], error: null }),
          is: () => Promise.resolve({ data: [], error: null }),
          in: () => Promise.resolve({ data: [], error: null }),
          contains: () => Promise.resolve({ data: [], error: null }),
          containedBy: () => Promise.resolve({ data: [], error: null }),
          rangeGt: () => Promise.resolve({ data: [], error: null }),
          rangeGte: () => Promise.resolve({ data: [], error: null }),
          rangeLt: () => Promise.resolve({ data: [], error: null }),
          rangeLte: () => Promise.resolve({ data: [], error: null }),
          rangeAdjacent: () => Promise.resolve({ data: [], error: null }),
          overlaps: () => Promise.resolve({ data: [], error: null }),
          textSearch: () => Promise.resolve({ data: [], error: null }),
          match: () => Promise.resolve({ data: [], error: null }),
          not: () => Promise.resolve({ data: [], error: null }),
          or: () => Promise.resolve({ data: [], error: null }),
          filter: () => Promise.resolve({ data: [], error: null }),
          then: (callback: any) => callback({ data: [], error: null })
        }),
        eq: () => ({
          order: () => Promise.resolve({ data: [], error: null }),
          then: (callback: any) => callback({ data: [], error: null })
        }),
        neq: () => ({
          order: () => Promise.resolve({ data: [], error: null }),
          then: (callback: any) => callback({ data: [], error: null })
        }),
        gt: () => ({
          order: () => Promise.resolve({ data: [], error: null }),
          then: (callback: any) => callback({ data: [], error: null })
        }),
        gte: () => ({
          order: () => Promise.resolve({ data: [], error: null }),
          then: (callback: any) => callback({ data: [], error: null })
        }),
        lt: () => ({
          order: () => Promise.resolve({ data: [], error: null }),
          then: (callback: any) => callback({ data: [], error: null })
        }),
        lte: () => ({
          order: () => Promise.resolve({ data: [], error: null }),
          then: (callback: any) => callback({ data: [], error: null })
        }),
        like: () => ({
          order: () => Promise.resolve({ data: [], error: null }),
          then: (callback: any) => callback({ data: [], error: null })
        }),
        ilike: () => ({
          order: () => Promise.resolve({ data: [], error: null }),
          then: (callback: any) => callback({ data: [], error: null })
        }),
        is: () => ({
          order: () => Promise.resolve({ data: [], error: null }),
          then: (callback: any) => callback({ data: [], error: null })
        }),
        in: () => ({
          order: () => Promise.resolve({ data: [], error: null }),
          then: (callback: any) => callback({ data: [], error: null })
        }),
        contains: () => ({
          order: () => Promise.resolve({ data: [], error: null }),
          then: (callback: any) => callback({ data: [], error: null })
        }),
        containedBy: () => ({
          order: () => Promise.resolve({ data: [], error: null }),
          then: (callback: any) => callback({ data: [], error: null })
        }),
        rangeGt: () => ({
          order: () => Promise.resolve({ data: [], error: null }),
          then: (callback: any) => callback({ data: [], error: null })
        }),
        rangeGte: () => ({
          order: () => Promise.resolve({ data: [], error: null }),
          then: (callback: any) => callback({ data: [], error: null })
        }),
        rangeLt: () => ({
          order: () => Promise.resolve({ data: [], error: null }),
          then: (callback: any) => callback({ data: [], error: null })
        }),
        rangeLte: () => ({
          order: () => Promise.resolve({ data: [], error: null }),
          then: (callback: any) => callback({ data: [], error: null })
        }),
        rangeAdjacent: () => ({
          order: () => Promise.resolve({ data: [], error: null }),
          then: (callback: any) => callback({ data: [], error: null })
        }),
        overlaps: () => ({
          order: () => Promise.resolve({ data: [], error: null }),
          then: (callback: any) => callback({ data: [], error: null })
        }),
        textSearch: () => ({
          order: () => Promise.resolve({ data: [], error: null }),
          then: (callback: any) => callback({ data: [], error: null })
        }),
        match: () => ({
          order: () => Promise.resolve({ data: [], error: null }),
          then: (callback: any) => callback({ data: [], error: null })
        }),
        not: () => ({
          order: () => Promise.resolve({ data: [], error: null }),
          then: (callback: any) => callback({ data: [], error: null })
        }),
        or: () => ({
          order: () => Promise.resolve({ data: [], error: null }),
          then: (callback: any) => callback({ data: [], error: null })
        }),
        filter: () => ({
          order: () => Promise.resolve({ data: [], error: null }),
          then: (callback: any) => callback({ data: [], error: null })
        }),
        then: (callback: any) => callback({ data: [], error: null })
      }),
      insert: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      update: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      delete: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
    }),
    auth: {
      signUp: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      signIn: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      signOut: () => Promise.resolve({ error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    }
  };
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  // Test connection on initialization
  testSupabaseConnection(supabase).then(accessible => {
    isSupabaseAccessible = accessible;
    if (!accessible) {
      console.warn('Supabase project is not accessible. Some features may not work.');
    }
  }).catch(() => {
    isSupabaseAccessible = false;
    console.warn('Unable to test Supabase connection.');
  });
}

export { supabase, isSupabaseAccessible };

// Database Types
export interface Customer {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  province: string;
  postal_code: string;
  unit_number?: string;
  service_area: 'south-surrey' | 'langley' | 'white-rock';
  created_at: string;
  updated_at: string;
}

export interface ClothingItem {
  id: string;
  name: string;
  category: 'men_formal_wear' | 'men_casual_wear' | 'men_ethnic_cultural_wear' | 'men_outerwear' | 'men_seasonal_layering' |
            'women_tops_blouses' | 'women_bottoms' | 'women_dresses' | 'women_ethnic_cultural_wear' | 'women_outerwear' | 'women_other_items' |
            'household_bedding' | 'household_table_linens' | 'household_window_treatments' | 'household_bath_linens' | 'household_miscellaneous';
  base_price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  status: 'payment_initiated' | 'pending_pickup' | 'picked_up' | 'in_progress' | 'ready_for_delivery' | 'out_for_delivery' | 'completed' | 'cancelled' | 'payment_failed';
  is_express_service: boolean;
  subtotal: number;
  delivery_fee: number;
  total_amount: number;
  pickup_date: string;
  pickup_time_slot: 'morning' | 'afternoon' | 'evening';
  delivery_date: string;
  delivery_time_slot: 'morning' | 'afternoon' | 'evening';
  special_instructions?: string;
  payment_intent_id?: string;
  payment_status?: 'pending' | 'succeeded' | 'failed' | 'canceled';
  created_at: string;
  updated_at: string;
  coupon_code?: string;
  discount_amount?: number;
}

export interface OrderItem {
  id: string;
  order_id: string;
  clothing_item_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
  clothing_item?: ClothingItem;
}

export interface BlogArticle {
  id: string;
  title: string;
  content: string;
  slug: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  author: string;
  image_url?: string;
  published_at?: string;
  categories: string[];
  likes: number;
  views: number;
  last_viewed_at?: string;
  // Computed properties
  excerpt: string;
  readTime: string;
  image: string;
}

export interface ChatSession {
  id: string;
  name: string;
  email: string;
  status: 'open' | 'closed' | 'pending';
  created_at: string;
  updated_at: string;
  last_message_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  sender_type: 'user' | 'agent';
  message_content: string;
  created_at: string;
}

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

// Helper functions for status display
export const getStatusDisplayName = (status: Order['status']) => {
  const statusMap = {
    payment_initiated: 'Payment in Progress',
    pending_pickup: 'Pending Pickup',
    picked_up: 'Picked Up',
    in_progress: 'In Progress',
    ready_for_delivery: 'Ready for Delivery',
    out_for_delivery: 'Out for Delivery',
    completed: 'Completed',
    cancelled: 'Cancelled',
    payment_failed: 'Payment Failed'
  };
  return statusMap[status] || status;
};

export const getTimeSlotDisplayName = (timeSlot: string) => {
  const timeSlotMap = {
    afternoon: 'Afternoon (4:00 PM - 6:00 PM)',
    evening: 'Evening (6:00 PM - 8:00 PM)'
  };
  return timeSlotMap[timeSlot as keyof typeof timeSlotMap] || timeSlot;
};