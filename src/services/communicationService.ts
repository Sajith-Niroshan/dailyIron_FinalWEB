import { supabase } from '../lib/supabase';

export interface CommunicationRecord {
  id: string;
  customer_id: string;
  order_id?: string;
  type: 'sms' | 'email';
  subject?: string;
  body: string;
  sent_at: string;
  status: 'sent' | 'failed' | 'pending';
  external_id?: string;
}

export interface SendSMSRequest {
  customerId: string;
  orderId?: string;
  phone: string;
  message: string;
  orderNumber?: string;
}

export interface SendEmailRequest {
  customerId: string;
  orderId?: string;
  email: string;
  subject: string;
  html?: string;
  text?: string;
  orderNumber?: string;
  customerName?: string;
}

export class CommunicationService {
  static async sendSMS(request: SendSMSRequest): Promise<{ success: boolean; error?: string; communicationId?: string }> {
    try {
      console.log('Sending SMS notification:', {
        customerId: request.customerId,
        orderId: request.orderId,
        phone: request.phone,
        orderNumber: request.orderNumber
      });

      // Check if Supabase is properly configured
      if (!import.meta.env.VITE_SUPABASE_URL || 
          import.meta.env.VITE_SUPABASE_URL === 'your_supabase_project_url') {
        console.warn('Supabase not configured, cannot send SMS');
        return { success: false, error: 'Database not configured' };
      }

      // First, log the communication attempt in the database
      const { data: communicationRecord, error: dbError } = await supabase
        .from('communication_history')
        .insert({
          customer_id: request.customerId,
          order_id: request.orderId,
          type: 'sms',
          body: request.message,
          status: 'pending'
        })
        .select()
        .single();

      if (dbError) {
        console.error('Error creating communication record:', dbError);
        return { success: false, error: 'Failed to log communication' };
      }

      console.log('Communication record created:', communicationRecord.id);

      try {
        // Send SMS via Supabase Edge Function
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-sms`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: request.phone,
            message: request.message,
            orderNumber: request.orderNumber
          })
        });

        const smsResult = await response.json();

        if (smsResult.success) {
          // Update communication record as sent
          await supabase
            .from('communication_history')
            .update({
              status: 'sent',
              external_id: smsResult.messageSid,
              sent_at: new Date().toISOString()
            })
            .eq('id', communicationRecord.id);

          console.log('SMS sent successfully:', smsResult.messageSid);
          return { success: true, communicationId: communicationRecord.id };
        } else {
          throw new Error(smsResult.error || 'SMS sending failed');
        }
      } catch (smsError) {
        console.error('SMS sending failed:', smsError);
        
        // Update communication record as failed
        await supabase
          .from('communication_history')
          .update({
            status: 'failed'
          })
          .eq('id', communicationRecord.id);

        return { 
          success: false, 
          error: smsError instanceof Error ? smsError.message : 'SMS sending failed',
          communicationId: communicationRecord.id 
        };
      }
    } catch (error) {
      console.error('Error in sendSMS:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  static async sendEmail(request: SendEmailRequest): Promise<{ success: boolean; error?: string; communicationId?: string }> {
    try {
      console.log('=== COMMUNICATION SERVICE EMAIL DEBUG ===');
      console.log('sendEmail called with request:', request);
      console.log('customerId:', request.customerId);
      console.log('orderId:', request.orderId);
      console.log('email:', request.email);
      console.log('subject:', request.subject);
      console.log('html length:', request.html?.length || 0);
      console.log('text length:', request.text?.length || 0);
      console.log('orderNumber:', request.orderNumber);
      console.log('customerName:', request.customerName);
      console.log('==========================================');

      // Client-side validation
      if (!request.email || !request.subject) {
        const error = 'Missing required fields: email and subject are required';
        console.error('CLIENT-SIDE VALIDATION FAILED:', error);
        return { success: false, error };
      }

      if (!request.html && !request.text) {
        const error = 'Missing required fields: either html or text content is required';
        console.error('CLIENT-SIDE VALIDATION FAILED:', error);
        return { success: false, error };
      }

      console.log('Sending email notification:', {
        customerId: request.customerId,
        orderId: request.orderId,
        email: request.email,
        subject: request.subject,
        orderNumber: request.orderNumber
      });

      // Check if Supabase is properly configured
      if (!import.meta.env.VITE_SUPABASE_URL || 
          import.meta.env.VITE_SUPABASE_URL === 'your_supabase_project_url') {
        console.warn('Supabase not configured, cannot send email');
        return { success: false, error: 'Database not configured' };
      }

      // First, log the communication attempt in the database
      const { data: communicationRecord, error: dbError } = await supabase
        .from('communication_history')
        .insert({
          customer_id: request.customerId,
          order_id: request.orderId,
          type: 'email',
          subject: request.subject,
          body: request.text || request.html || '',
          status: 'pending'
        })
        .select()
        .single();

      if (dbError) {
        console.error('Error creating communication record:', dbError);
        return { success: false, error: 'Failed to log communication' };
      }

      console.log('Communication record created:', communicationRecord.id);

      try {
        // Prepare payload for edge function - Map 'email' to 'to'
        const emailPayload = {
          to: request.email,
          subject: request.subject,
          html: request.html,
          text: request.text,
          orderNumber: request.orderNumber,
          customerName: request.customerName
        };

        console.log('=== ABOUT TO SEND TO EDGE FUNCTION ===');
        console.log('Payload being sent to edge function:', emailPayload);
        console.log('to:', emailPayload.to);
        console.log('subject:', emailPayload.subject);
        console.log('html length:', emailPayload.html?.length || 0);
        console.log('text length:', emailPayload.text?.length || 0);
        console.log('=====================================');

        // Send email via Supabase Edge Function
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailPayload)
        });

        const emailResult = await response.json();

        if (emailResult.success) {
          // Update communication record as sent
          await supabase
            .from('communication_history')
            .update({
              status: 'sent',
              external_id: emailResult.messageId,
              sent_at: new Date().toISOString()
            })
            .eq('id', communicationRecord.id);

          console.log('Email sent successfully:', emailResult.messageId);
          return { success: true, communicationId: communicationRecord.id };
        } else {
          throw new Error(emailResult.error || 'Email sending failed');
        }
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        
        // Update communication record as failed
        await supabase
          .from('communication_history')
          .update({
            status: 'failed'
          })
          .eq('id', communicationRecord.id);

        return { 
          success: false, 
          error: emailError instanceof Error ? emailError.message : 'Email sending failed',
          communicationId: communicationRecord.id 
        };
      }
    } catch (error) {
      console.error('Error in sendEmail:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  static async getCommunicationHistory(filters?: {
    customerId?: string;
    orderId?: string;
    type?: 'sms' | 'email';
    status?: 'sent' | 'failed' | 'pending';
    limit?: number;
  }): Promise<CommunicationRecord[]> {
    try {
      console.log('Fetching communication history...');
      
      // Check if Supabase is properly configured
      if (!import.meta.env.VITE_SUPABASE_URL || 
          import.meta.env.VITE_SUPABASE_URL === 'your_supabase_project_url') {
        console.warn('Supabase not configured, cannot fetch communication history');
        return [];
      }

      let query = supabase
        .from('communication_history')
        .select('*')
        .order('sent_at', { ascending: false });

      if (filters?.customerId) {
        query = query.eq('customer_id', filters.customerId);
      }

      if (filters?.orderId) {
        query = query.eq('order_id', filters.orderId);
      }

      if (filters?.type) {
        query = query.eq('type', filters.type);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching communication history:', error);
        throw error;
      }

      console.log(`Successfully fetched ${data?.length || 0} communication records`);
      return data || [];
    } catch (error) {
      console.error('Error in getCommunicationHistory:', error);
      return [];
    }
  }

  static generateOrderConfirmationSMS(customerName: string, orderNumber: string, pickupDate: Date | string): string {
    // Format the pickup date to show only the date without time
    let formattedDate: string;
    
    if (pickupDate instanceof Date) {
      // Format as "Jan 15, 2025" for shorter SMS
      formattedDate = pickupDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        timeZone: 'America/Vancouver' // Use local timezone to prevent date shifting
      });
    } else if (typeof pickupDate === 'string') {
      // Parse date string as local date to prevent timezone shifting
      try {
        // If the string is in YYYY-MM-DD format, parse it as local date
        if (/^\d{4}-\d{2}-\d{2}$/.test(pickupDate)) {
          const [year, month, day] = pickupDate.split('-').map(Number);
          const localDate = new Date(year, month - 1, day); // month is 0-indexed
          formattedDate = localDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          });
        } else {
          // For other formats, try to parse normally but use local timezone
          const dateObj = new Date(pickupDate);
          formattedDate = dateObj.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric',
            timeZone: 'America/Vancouver'
          });
        }
      } catch (error) {
        // If parsing fails, use the string as-is
        formattedDate = pickupDate;
      }
    } else {
      formattedDate = 'your scheduled date';
    }

    return `Hi ${customerName}! Your ironing order ${orderNumber} is confirmed. Pickup scheduled for ${formattedDate}. We'll send updates as we process your order. Questions? Call (778) 743-7737`;
  }

  static generateOrderConfirmationEmail(customerName: string, orderNumber: string, orderDetails: any): { subject: string; html: string; text: string } {
    const subject = `Order Confirmation - ${orderNumber}`;
    
    // Format pickup and delivery dates for email
    const formatDate = (date: Date | string) => {
      if (date instanceof Date) {
        return date.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long', 
          day: 'numeric', 
          year: 'numeric',
          timeZone: 'America/Vancouver' // Use local timezone
        });
      } else if (typeof date === 'string') {
        try {
          // If the string is in YYYY-MM-DD format, parse it as local date
          if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            const [year, month, day] = date.split('-').map(Number);
            const localDate = new Date(year, month - 1, day); // month is 0-indexed
            return localDate.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long', 
              day: 'numeric', 
              year: 'numeric'
            });
          } else {
            const dateObj = new Date(date);
            return dateObj.toLocaleDateString('en-US', { 
              weekday: 'long',
              month: 'long', 
              day: 'numeric', 
              year: 'numeric',
              timeZone: 'America/Vancouver'
            });
          }
        } catch (error) {
          return date;
        }
      }
      return date;
    };

    const formattedPickupDate = formatDate(orderDetails.pickupDate);
    const formattedDeliveryDate = formatDate(orderDetails.deliveryDate);
    
    const text = `Hi ${customerName},

Thank you for choosing Daily Ironing Service! Your order ${orderNumber} has been confirmed and payment processed successfully.

Order Details:
- Order Number: ${orderNumber}
- Pickup Date: ${formattedPickupDate}
- Pickup Time: ${orderDetails.pickupTime}
- Delivery Date: ${formattedDeliveryDate}
- Total Amount: $${orderDetails.totalAmount}

What's Next:
1. We'll send you pickup confirmation via SMS and email
2. Our driver will arrive with a confirmation code
3. Your clothes will be professionally pressed
4. We'll deliver them back fresh and wrinkle-free

Questions? Contact us:
Phone: (778) 743-7737
Email: hello@dailyironing.ca

Thank you for your business!
Daily Ironing Service Team`;

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #2C3E50; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #E87461; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #FFF8F0; padding: 30px; border-radius: 0 0 8px 8px; }
        .order-details { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .steps { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .step { margin-bottom: 10px; }
        .contact { background-color: #2C3E50; color: white; padding: 20px; text-align: center; border-radius: 8px; margin-top: 20px; }
        .highlight { color: #E87461; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Order Confirmed!</h1>
            <p>Thank you for choosing Daily Ironing Service</p>
        </div>
        
        <div class="content">
            <p>Hi <strong>${customerName}</strong>,</p>
            
            <p>Your order <span class="highlight">${orderNumber}</span> has been confirmed and payment processed successfully.</p>
            
            <div class="order-details">
                <h3>Order Details</h3>
                <p><strong>Order Number:</strong> ${orderNumber}</p>
                <p><strong>Pickup Date:</strong> ${formattedPickupDate}</p>
                <p><strong>Pickup Time:</strong> ${orderDetails.pickupTime}</p>
                <p><strong>Delivery Date:</strong> ${formattedDeliveryDate}</p>
                <p><strong>Total Amount:</strong> <span class="highlight">$${orderDetails.totalAmount}</span></p>
            </div>
            
            <div class="steps">
                <h3>What's Next?</h3>
                <div class="step">1. We'll send you pickup confirmation via SMS and email</div>
                <div class="step">2. Our driver will arrive with a confirmation code</div>
                <div class="step">3. Your clothes will be professionally pressed</div>
                <div class="step">4. We'll deliver them back fresh and wrinkle-free</div>
            </div>
            
            <p>We're excited to take care of your garments with the professional attention they deserve!</p>
        </div>
        
        <div class="contact">
            <h3>Questions? We're Here to Help</h3>
            <p><strong>Phone:</strong> (778) 743-7737</p>
            <p><strong>Email:</strong> hello@dailyironing.ca</p>
            <p style="margin-top: 20px;">Thank you for your business!<br>Daily Ironing Service Team</p>
        </div>
    </div>
</body>
</html>`;

    return { subject, html, text };
  }
}