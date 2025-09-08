import { supabase } from '../lib/supabase';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'resolved';
  created_at: string;
  updated_at: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export class ContactService {
  static async submitContactMessage(formData: ContactFormData): Promise<{ success: boolean; error?: string; messageId?: string }> {
    try {
      console.log('Submitting contact message:', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        messageLength: formData.message.length
      });

      // Check if Supabase is properly configured
      if (!import.meta.env.VITE_SUPABASE_URL || 
          import.meta.env.VITE_SUPABASE_URL === 'your_supabase_project_url') {
        console.warn('Supabase not configured, cannot submit contact message');
        return { success: false, error: 'Database not configured' };
      }

      // Validate form data
      if (!formData.name || !formData.email || !formData.phone || !formData.message) {
        return { success: false, error: 'All fields are required' };
      }

      // Insert contact message into database
      const { data, error } = await supabase
        .from('contact_messages')
        .insert({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          message: formData.message.trim(),
          status: 'new'
        })
        .select()
        .single();

      if (error) {
        console.error('Error submitting contact message:', error);
        return { success: false, error: error.message };
      }

      console.log('Contact message submitted successfully:', data.id);
      return { success: true, messageId: data.id };
    } catch (error) {
      console.error('Error in submitContactMessage:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  static async getContactMessages(filters?: {
    status?: string;
    limit?: number;
  }): Promise<ContactMessage[]> {
    try {
      console.log('Fetching contact messages...');
      
      // Check if Supabase is properly configured
      if (!import.meta.env.VITE_SUPABASE_URL || 
          import.meta.env.VITE_SUPABASE_URL === 'your_supabase_project_url') {
        console.warn('Supabase not configured, cannot fetch contact messages');
        return [];
      }

      let query = supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching contact messages:', error);
        throw error;
      }

      console.log(`Successfully fetched ${data?.length || 0} contact messages`);
      return data || [];
    } catch (error) {
      console.error('Error in getContactMessages:', error);
      return [];
    }
  }

  static async updateMessageStatus(messageId: string, status: 'new' | 'read' | 'replied' | 'resolved'): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Updating message status:', { messageId, status });
      
      // Check if Supabase is properly configured
      if (!import.meta.env.VITE_SUPABASE_URL || 
          import.meta.env.VITE_SUPABASE_URL === 'your_supabase_project_url') {
        console.warn('Supabase not configured, cannot update message status');
        return { success: false, error: 'Database not configured' };
      }

      const { error } = await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', messageId);

      if (error) {
        console.error('Error updating message status:', error);
        return { success: false, error: error.message };
      }

      console.log('Message status updated successfully');
      return { success: true };
    } catch (error) {
      console.error('Error in updateMessageStatus:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }
}