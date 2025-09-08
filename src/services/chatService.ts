import { supabase } from '../lib/supabase';

// Helper function to handle Supabase errors gracefully
const handleSupabaseError = (error: any, operation: string) => {
  console.warn(`Error in ${operation}:`, error?.message || error);
  
  // Check if it's a network/fetch error
  if (error.message?.includes('Failed to fetch') || error.name === 'TypeError') {
    return 'Unable to connect to chat service. Please check your internet connection and try again.';
  }
  
  return error.message || 'An unexpected error occurred';
};
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

export interface StartChatRequest {
  name: string;
  email: string;
  initialMessage?: string;
}

export class ChatService {
  static async startNewChatSession(request: StartChatRequest): Promise<{ success: boolean; sessionId?: string; error?: string }> {
    try {
      console.log('Starting new chat session:', { name: request.name, email: request.email });
      
      // Check if Supabase is properly configured
      if (!import.meta.env.VITE_SUPABASE_URL || 
          import.meta.env.VITE_SUPABASE_URL === 'your_supabase_project_url') {
        console.warn('Supabase not configured, cannot start chat session');
        return { success: false, error: 'Chat system not available' };
      }

      // Create new chat session
      const { data: session, error: sessionError } = await supabase
        .from('chat_sessions')
        .insert({
          name: request.name.trim(),
          email: request.email.trim().toLowerCase(),
          status: 'open'
        })
        .select()
        .single();

      if (sessionError) {
        const errorMessage = handleSupabaseError(sessionError, 'creating chat session');
        return { success: false, error: errorMessage };
      }

      console.log('Chat session created:', session.id);

      // Add initial message if provided
      if (request.initialMessage) {
        const messageResult = await this.addChatMessage(
          session.id, 
          'user', 
          request.initialMessage
        );
        
        if (!messageResult.success) {
          console.warn('Failed to add initial message, but session created');
        }
      }

      return { success: true, sessionId: session.id };
    } catch (error) {
      const errorMessage = handleSupabaseError(error, 'starting chat session');
      return { 
        success: false, 
        error: errorMessage
      };
    }
  }

  static async addChatMessage(
    sessionId: string, 
    senderType: 'user' | 'agent', 
    messageContent: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      console.log('Adding chat message:', { sessionId, senderType, messageLength: messageContent.length });
      
      // Check if Supabase is properly configured
      if (!import.meta.env.VITE_SUPABASE_URL || 
          import.meta.env.VITE_SUPABASE_URL === 'your_supabase_project_url') {
        console.warn('Supabase not configured, cannot add chat message');
        return { success: false, error: 'Chat system not available' };
      }

      // Validate input
      if (!messageContent.trim()) {
        return { success: false, error: 'Message content cannot be empty' };
      }

      // Insert chat message
      const { data: message, error } = await supabase
        .from('chat_messages')
        .insert({
          session_id: sessionId,
          sender_type: senderType,
          message_content: messageContent.trim()
        })
        .select()
        .single();

      if (error) {
        const errorMessage = handleSupabaseError(error, 'adding chat message');
        return { success: false, error: errorMessage };
      }

      console.log('Chat message added:', message.id);
      return { success: true, messageId: message.id };
    } catch (error) {
      const errorMessage = handleSupabaseError(error, 'adding chat message');
      return { 
        success: false, 
        error: errorMessage
      };
    }
  }

  static async getChatMessages(sessionId: string): Promise<ChatMessage[]> {
    try {
      console.log('Fetching chat messages for session:', sessionId);
      
      // Check if Supabase is properly configured
      if (!import.meta.env.VITE_SUPABASE_URL || 
          import.meta.env.VITE_SUPABASE_URL === 'your_supabase_project_url') {
        console.warn('Supabase not configured, cannot fetch chat messages');
        return [];
      }

      const { data: messages, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) {
        console.warn('Supabase error fetching chat messages:', error.message);
        return [];
      }

      console.log(`Successfully fetched ${messages?.length || 0} chat messages`);
      return messages || [];
    } catch (error) {
      console.warn('Network error fetching chat messages:', error);
      return [];
    }
  }

  static async getChatSession(sessionId: string): Promise<ChatSession | null> {
    try {
      console.log('Fetching chat session:', sessionId);
      
      // Check if Supabase is properly configured
      if (!import.meta.env.VITE_SUPABASE_URL || 
          import.meta.env.VITE_SUPABASE_URL === 'your_supabase_project_url') {
        console.warn('Supabase not configured, cannot fetch chat session');
        return null;
      }

      const { data: session, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('id', sessionId)
        .maybeSingle();

      if (error) {
        console.warn('Supabase error fetching chat session:', error.message);
        return null;
      }

      return session;
    } catch (error) {
      console.warn('Network error fetching chat session:', error);
      return null;
    }
  }

  static async updateChatSessionStatus(
    sessionId: string, 
    status: 'open' | 'closed' | 'pending'
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Updating chat session status:', { sessionId, status });
      
      // Check if Supabase is properly configured
      if (!import.meta.env.VITE_SUPABASE_URL || 
          import.meta.env.VITE_SUPABASE_URL === 'your_supabase_project_url') {
        console.warn('Supabase not configured, cannot update chat session');
        return { success: false, error: 'Chat system not available' };
      }

      const { error } = await supabase
        .from('chat_sessions')
        .update({ status })
        .eq('id', sessionId);

      if (error) {
        const errorMessage = handleSupabaseError(error, 'updating chat session status');
        return { success: false, error: errorMessage };
      }

      console.log('Chat session status updated successfully');
      return { success: true };
    } catch (error) {
      const errorMessage = handleSupabaseError(error, 'updating chat session status');
      return { 
        success: false, 
        error: errorMessage
      };
    }
  }
}