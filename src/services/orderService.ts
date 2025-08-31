import { supabase, type Order, type Customer } from '../lib/supabase';

export interface CreateOrderData {
  customerInfo: {
    fullName: string;
    email: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    province: string;
    postalCode: string;
    unitNumber?: string;
    pickupDate: string;
    pickupTime: string;
    deliveryDate: string;
    deliveryTime: string;
    specialInstructions?: string;
  };
  orderDetails: {
    items: Array<{
      name: string;
      price: number;
      quantity: number;
    }>;
    is24HourService: boolean;
    pricing: {
      baseTotal: number;
      deliveryFee: number;
      finalTotal: number;
      totalItems: number;
      discountAmount?: number;
    };
    paymentIntentId?: string;
    pickupDate: string;
    deliveryDate: string;
  };
  couponCode?: string;
  discountAmount?: number;
}

export class OrderService {
  static async createOrder(orderData: CreateOrderData, initialStatus: string = 'pending_pickup'): Promise<{ success: boolean; orderId?: string; customerId?: string; error?: string }> {
    try {
      console.log('Starting order creation process...');
      console.log('Order data received:', {
        customerEmail: orderData.customerInfo.email,
        itemCount: orderData.orderDetails.items.length,
        totalAmount: orderData.orderDetails.pricing.finalTotal,
        isExpress: orderData.orderDetails.is24HourService
      });

      // First, check if customer exists or create new one
      let customer = await this.findOrCreateCustomer(orderData.customerInfo);
      
      if (!customer) {
        console.error('Failed to create or find customer');
        return { success: false, error: 'Failed to create or find customer' };
      }

      console.log('Customer created/found successfully:', customer.id);

      // Create the order
      const orderPayload = {
        customer_id: customer.id,
        status: initialStatus,
        is_express_service: orderData.orderDetails.is24HourService,
        subtotal: orderData.orderDetails.pricing.baseTotal,
        delivery_fee: orderData.orderDetails.pricing.deliveryFee,
        total_amount: orderData.orderDetails.pricing.finalTotal,
        pickup_date: orderData.customerInfo.pickupDate,
        pickup_time_slot: this.normalizeTimeSlot(orderData.customerInfo.pickupTime),
        delivery_date: orderData.customerInfo.deliveryDate,
        delivery_time_slot: this.normalizeTimeSlot(orderData.customerInfo.deliveryTime),
        special_instructions: orderData.customerInfo.specialInstructions,
        payment_intent_id: orderData.orderDetails.paymentIntentId,
        payment_status: orderData.orderDetails.paymentIntentId ? 'succeeded' : 'pending',
        coupon_code: orderData.couponCode || null,
        discount_amount: orderData.discountAmount || 0
      };

      console.log('Creating order with payload:', orderPayload);

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderPayload)
        .select()
        .single();

      if (orderError) {
        console.error('Order creation error details:', orderError);
        console.error('Order creation error code:', orderError.code);
        console.error('Order creation error message:', orderError.message);
        console.error('Order creation error hint:', orderError.hint);
        console.error('Order creation error details object:', JSON.stringify(orderError, null, 2));
        
        // Return more specific error message
        let errorMessage = 'Failed to create order';
        if (orderError.message) {
          errorMessage = `Database error: ${orderError.message}`;
        }
        if (orderError.hint) {
          errorMessage += ` (${orderError.hint})`;
        }
        
        return { success: false, error: errorMessage };
      }

      console.log('Order created successfully:', order.id);

      // Only create order items if not in payment_initiated status
      if (initialStatus !== 'payment_initiated') {
        const orderItems = await this.createOrderItems(order.id, orderData.orderDetails.items, orderData.orderDetails.is24HourService);
        
        if (!orderItems) {
          console.error('Failed to create order items for order:', order.id);
          return { success: false, error: 'Failed to create order items' };
        }
      }

      console.log('Order creation completed successfully:', order.id);
      return { success: true, orderId: order.id, customerId: customer.id };
    } catch (error) {
      console.error('Error creating order - full error details:', error);
      console.error('Error stack trace:', error.stack);
      
      // Return more specific error message
      let errorMessage = 'An unexpected error occurred';
      if (error instanceof Error) {
        errorMessage = `Unexpected error: ${error.message}`;
      }
      
      return { success: false, error: errorMessage };
    }
  }

  static async updateOrderStatusAndPayment(orderId: string, status: string, paymentStatus: string, paymentIntentId?: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Updating order status and payment:', { orderId, status, paymentStatus, paymentIntentId });
      
      const updatePayload: any = {
        status,
        payment_status: paymentStatus
      };
      
      if (paymentIntentId) {
        updatePayload.payment_intent_id = paymentIntentId;
      }
      
      const { error } = await supabase
        .from('orders')
        .update(updatePayload)
        .eq('id', orderId);

      if (error) {
        console.error('Order update error:', error);
        return { success: false, error: error.message };
      }

      console.log('Order updated successfully');
      return { success: true };
    } catch (error) {
      console.error('Error updating order:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  static async addOrderItems(orderId: string, items: any[], isExpress: boolean): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Adding order items to existing order:', orderId);
      
      const success = await this.createOrderItems(orderId, items, isExpress);
      
      if (!success) {
        return { success: false, error: 'Failed to create order items' };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error adding order items:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  static async getOrderById(orderId: string): Promise<{ success: boolean; order?: any; customer?: any; error?: string }> {
    try {
      console.log('Fetching order by ID:', orderId);
      
      // Check if Supabase is properly configured
      if (!import.meta.env.VITE_SUPABASE_URL || 
          import.meta.env.VITE_SUPABASE_URL === 'your_supabase_project_url') {
        console.warn('Supabase not configured, cannot fetch order');
        return { success: false, error: 'Database not configured' };
      }

      // Fetch order with customer information
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          customers (*)
        `)
        .eq('id', orderId)
        .single();

      if (orderError) {
        console.error('Error fetching order:', orderError);
        return { success: false, error: orderError.message };
      }

      if (!order) {
        return { success: false, error: 'Order not found' };
      }

      console.log('Successfully fetched order:', order.id);
      return { 
        success: true, 
        order, 
        customer: order.customers 
      };
    } catch (error) {
      console.error('Error in getOrderById:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  static async finalizeOrder(
    orderId: string, 
    paymentIntentId: string, 
    items: any[], 
    isExpress: boolean,
    couponCode?: string,
    tipAmount?: number,
    discountAmount?: number,
    totalAmount?: number
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Finalizing order:', orderId, 'with payment:', paymentIntentId);
      
      // Check if Supabase is properly configured
      if (!import.meta.env.VITE_SUPABASE_URL || 
          import.meta.env.VITE_SUPABASE_URL === 'your_supabase_project_url') {
        console.warn('Supabase not configured, cannot finalize order');
        return { success: false, error: 'Database not configured' };
      }

      // Update order with payment information and final status
      const updatePayload: any = {
        status: 'pending_pickup',
        payment_status: 'succeeded',
        payment_intent_id: paymentIntentId
      };

      if (couponCode) {
        updatePayload.coupon_code = couponCode;
      }

      if (tipAmount) {
        updatePayload.tip_amount = tipAmount;
      }

      if (discountAmount) {
        updatePayload.discount_amount = discountAmount;
      }

      if (totalAmount) {
        updatePayload.total_amount = totalAmount;
      }

      const { error: updateError } = await supabase
        .from('orders')
        .update(updatePayload)
        .eq('id', orderId);

      if (updateError) {
        console.error('Error updating order:', updateError);
        return { success: false, error: updateError.message };
      }

      console.log('Order updated successfully, now creating order items');

      // Create order items
      const orderItemsSuccess = await this.createOrderItems(orderId, items, isExpress);
      
      if (!orderItemsSuccess) {
        console.error('Failed to create order items for finalized order');
        return { success: false, error: 'Failed to create order items' };
      }

      console.log('Order finalized successfully');
      return { success: true };
    } catch (error) {
      console.error('Error in finalizeOrder:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
  private static async findOrCreateCustomer(customerInfo: any): Promise<Customer | null> {
    console.log('Finding or creating customer for email:', customerInfo.email);
    
    // First try to find existing customer by email
    const { data: existingCustomer, error: findError } = await supabase
      .from('customers')
      .select('*')
      .eq('email', customerInfo.email)
      .maybeSingle();

    if (findError) {
      console.error('Error finding customer - details:', findError);
      console.error('Error finding customer - code:', findError.code);
      console.error('Error finding customer - message:', findError.message);
      console.error('Error finding customer - full error:', JSON.stringify(findError, null, 2));
      return null;
    }

    if (existingCustomer) {
      console.log('Found existing customer:', existingCustomer.id);
      
      // Update customer info if changed
      const updatePayload = {
        full_name: customerInfo.fullName,
        phone: customerInfo.phone,
        address_line1: customerInfo.addressLine1,
        address_line2: customerInfo.addressLine2 || null,
        city: customerInfo.city,
        province: customerInfo.province,
        postal_code: customerInfo.postalCode,
        unit_number: customerInfo.unitNumber || null,
        service_area: this.determineServiceArea(customerInfo.city)
      };
      
      console.log('Updating customer with payload:', updatePayload);
      
      const { data: updatedCustomer, error } = await supabase
        .from('customers')
        .update(updatePayload)
        .eq('id', existingCustomer.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating customer - details:', error);
        console.error('Error updating customer - code:', error.code);
        console.error('Error updating customer - message:', error.message);
        console.error('Error updating customer - full error:', JSON.stringify(error, null, 2));
      }

      return updatedCustomer || existingCustomer;
    }

    // Create new customer
    const newCustomerPayload = {
      full_name: customerInfo.fullName,
      email: customerInfo.email,
      phone: customerInfo.phone,
      address_line1: customerInfo.addressLine1,
      address_line2: customerInfo.addressLine2 || null,
      city: customerInfo.city,
      province: customerInfo.province,
      postal_code: customerInfo.postalCode,
      unit_number: customerInfo.unitNumber || null,
      service_area: this.determineServiceArea(customerInfo.city)
    };
    
    console.log('Creating new customer with payload:', newCustomerPayload);
    
    const { data: newCustomer, error } = await supabase
      .from('customers')
      .insert(newCustomerPayload)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Customer creation error - details:', error);
      console.error('Customer creation error - code:', error.code);
      console.error('Customer creation error - message:', error.message);
      console.error('Customer creation error - hint:', error.hint);
      console.error('Customer creation error - full error:', JSON.stringify(error, null, 2));
      return null;
    }

    console.log('New customer created successfully:', newCustomer.id);
    return newCustomer;
  }

  private static async createOrderItems(orderId: string, items: any[], isExpress: boolean): Promise<boolean> {
    try {
      console.log('Creating order items for order:', orderId);
      console.log('Items to create:', items.length);
      
      // Get clothing items from database to match with order items
      const { data: clothingItems, error: clothingError } = await supabase
        .from('clothing_items')
        .select('*');

      if (clothingError) {
        console.error('Error fetching clothing items - details:', clothingError);
        console.error('Error fetching clothing items - code:', clothingError.code);
        console.error('Error fetching clothing items - message:', clothingError.message);
        console.error('Error fetching clothing items - full error:', JSON.stringify(clothingError, null, 2));
        return false;
      }

      if (!clothingItems) {
        console.error('No clothing items found in database');
        return false;
      }
      
      console.log('Found clothing items in database:', clothingItems.length);

      const orderItemsData = [];

      for (const item of items) {
        console.log('Processing item:', item.name);
        
        // Find matching clothing item
        const clothingItem = clothingItems.find(ci => 
          ci.name.toLowerCase() === item.name.toLowerCase()
        );

        if (!clothingItem) {
          console.warn(`Clothing item not found: ${item.name}`);
          console.log('Available clothing items:', clothingItems.map(ci => ci.name));
          continue;
        }

        console.log('Found matching clothing item:', clothingItem.id, clothingItem.name);
        
        // Calculate price (base price + express surcharge if applicable)
        const unitPrice = isExpress ? clothingItem.base_price + 1.00 : clothingItem.base_price;
        
        const orderItemData = {
          order_id: orderId,
          clothing_item_id: clothingItem.id,
          quantity: item.quantity,
          unit_price: unitPrice,
          total_price: unitPrice * item.quantity
        };
        
        console.log('Adding order item:', orderItemData);
        orderItemsData.push(orderItemData);
      }

      if (orderItemsData.length === 0) {
        console.error('No valid order items to create');
        console.log('Original items:', items);
        console.log('Available clothing items:', clothingItems.map(ci => ({ id: ci.id, name: ci.name, category: ci.category })));
        return false;
      }

      console.log('Inserting order items:', orderItemsData.length);
      
      const { error } = await supabase
        .from('order_items')
        .insert(orderItemsData);

      if (error) {
        console.error('Order items creation error - details:', error);
        console.error('Order items creation error - code:', error.code);
        console.error('Order items creation error - message:', error.message);
        console.error('Order items creation error - hint:', error.hint);
        console.error('Order items creation error - full error:', JSON.stringify(error, null, 2));
        console.error('Order items data that failed:', JSON.stringify(orderItemsData, null, 2));
        return false;
      }

      console.log('Order items created successfully');
      return true;
    } catch (error) {
      console.error('Error creating order items - full error details:', error);
      console.error('Error stack trace:', error.stack);
      return false;
    }
  }

  private static determineServiceArea(city: string): string {
    const cityLower = city.toLowerCase();
    
    // Map cities to allowed service areas in database
    if (cityLower.includes('south surrey')) {
      return 'south-surrey';
    } else if (cityLower.includes('surrey') || cityLower.includes('delta')) {
      return 'south-surrey'; // Map Surrey and Delta to South Surrey
    } else if (cityLower.includes('langley')) {
      return 'langley';
    } else if (cityLower.includes('white rock')) {
      return 'white-rock';
    }
    
    // Default to south-surrey for unknown cities
    return 'south-surrey';
  }

  private static normalizeTimeSlot(timeSlot: string): 'morning' | 'afternoon' | 'evening' {
    const slot = timeSlot.toLowerCase();
    
    if (slot.includes('morning')) return 'morning';
    if (slot.includes('afternoon')) return 'afternoon';
    if (slot.includes('evening')) return 'evening';
    
    return 'morning'; // Default
  }
}