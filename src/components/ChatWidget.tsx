import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, Headphones } from 'lucide-react';
import { ChatService, type ChatMessage, type ChatSession } from '../services/chatService';
import { supabase } from '../lib/supabase';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state for initial setup
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    initialMessage: ''
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  // Refs for scrolling behavior
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  // Set up Supabase Realtime subscription for chat messages - without messages dependency
  useEffect(() => {
    // Load stored session if it exists
    const loadSavedChatSession = async () => {
      const savedSessionId = localStorage.getItem('chatSessionId');
      
      if (savedSessionId) {
        try {
          console.log('Found saved chat session, attempting to restore:', savedSessionId);
          
          // Try to fetch the session
          const session = await ChatService.getChatSession(savedSessionId);
          
          if (session) {
            // Only restore if the session exists and is still open
            if (session.status === 'open') {
              console.log('Restoring chat session:', session.id);
              
              // Load messages for this session
              const sessionMessages = await ChatService.getChatMessages(savedSessionId);
              
              // Set state to restore the chat
              setCurrentSession(session);
              setMessages(sessionMessages || []);
              setIsStarted(true);
              setIsOpen(true); // Open the chat widget automatically
            } else {
              console.log('Saved chat session is closed');
              // If session is closed, clear storage
              localStorage.removeItem('chatSessionId');
            }
          } else {
            console.log('Saved chat session no longer exists or chat service unavailable');
            // If session doesn't exist or service is unavailable, clear storage
            localStorage.removeItem('chatSessionId');
          }
        } catch (error) {
          console.warn('Unable to load saved chat session - chat service may be unavailable:', error);
          // Clean up storage in case of error
          localStorage.removeItem('chatSessionId');
          // Don't show error to user for background restoration failures
        }
      }
    };
    
    loadSavedChatSession();
    
    if (!currentSession?.id) return;
    
    console.log('Setting up real-time subscription for chat session:', currentSession.id);
    
    // Check if Supabase is properly configured
    if (!import.meta.env.VITE_SUPABASE_URL || 
        import.meta.env.VITE_SUPABASE_URL === 'your_supabase_project_url') {
      console.warn('Supabase not configured, real-time chat updates unavailable');
      return;
    }
    
    try {
      // Subscribe to changes on chat_messages table for this session
      const channel = supabase
        .channel(`chat_messages_${currentSession.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_messages',
            filter: `session_id=eq.${currentSession.id}`
          },
          (payload) => {
            console.log('Real-time message received:', payload);
            
            const newMessage = payload.new as ChatMessage;
            
            // Use functional update to access the latest state and avoid duplicates
            setMessages(prevMessages => {
              // Only add if the message isn't already in the array
              if (!prevMessages.some(msg => msg.id === newMessage.id)) {
                return [...prevMessages, newMessage];
              }
              return prevMessages;
            });
          }
        )
        .subscribe();
        
      // Clean up the subscription when the component unmounts or session changes
      return () => {
        console.log('Cleaning up real-time subscription');
        try {
          channel.unsubscribe();
        } catch (error) {
          console.warn('Error cleaning up subscription:', error);
        }
      };
    } catch (error) {
      console.warn('Unable to set up real-time subscription:', error);
      // Continue without real-time updates
    }
  }, [currentSession]); // Remove messages dependency

  // Check if user is near the bottom whenever they scroll
  useEffect(() => {
    const checkScrollPosition = () => {
      const container = messagesContainerRef.current;
      if (!container) return;
      
      // Calculate if user is within 100px of bottom
      const isNearBottom = 
        container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      
      // Update auto-scroll state based on scroll position
      setShouldAutoScroll(isNearBottom);
    };
    
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      
      // Check initial position
      checkScrollPosition();
      
      return () => {
        container.removeEventListener('scroll', checkScrollPosition);
      };
    }
  }, []);

  // Auto-scroll to bottom when new messages arrive, but only if user is near bottom
  useEffect(() => {
    if (shouldAutoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus message input when chat is opened and started
  useEffect(() => {
    if (isOpen && isStarted && messageInputRef.current) {
      messageInputRef.current.focus();
    }
  }, [isOpen, isStarted]);

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.initialMessage.trim()) {
      errors.initialMessage = 'Please enter your question or message';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await ChatService.startNewChatSession({
        name: formData.name,
        email: formData.email,
        initialMessage: formData.initialMessage
      });

      if (result.success && result.sessionId) {
        // Fetch the session details and messages
        const session = await ChatService.getChatSession(result.sessionId);
        const sessionMessages = await ChatService.getChatMessages(result.sessionId);

        setCurrentSession(session);
        setMessages(sessionMessages);
        setIsStarted(true);
        setNewMessage('');
        
        // Save session ID to localStorage for persistence
        localStorage.setItem('chatSessionId', result.sessionId);
        
        // Add welcome message from "agent"
        setTimeout(async () => {
          await ChatService.addChatMessage(
            result.sessionId!, 
            'agent', 
            `Hi ${formData.name}! Thanks for reaching out. We've received your message and someone from our team will respond shortly. In the meantime, feel free to send any additional questions.`
          );
        }, 1000);
      } else {
        setError(result.error || 'Failed to start chat session');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error starting chat:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEndChat = async () => {
    if (currentSession?.id) {
      try {
        console.log('Ending chat session:', currentSession.id);
        
        await ChatService.updateChatSessionStatus(currentSession.id, 'closed');
        
        // Clear storage
        localStorage.removeItem('chatSessionId');
        
        // Reset state
        setIsStarted(false);
        setCurrentSession(null);
        setMessages([]);
        setFormData({
          name: '',
          email: '',
          initialMessage: ''
        });
        
        // Close chat widget
        setIsOpen(false);
      } catch (error) {
        console.error('Error ending chat:', error);
        setError('Failed to end chat session');
      }
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !currentSession) {
      return;
    }

    const messageToSend = newMessage.trim();
    setNewMessage('');

    // Optimistically add the message to the UI
    const tempMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      session_id: currentSession.id,
      sender_type: 'user',
      message_content: messageToSend,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempMessage]);

    try {
      const result = await ChatService.addChatMessage(
        currentSession.id,
        'user',
        messageToSend
      );

      if (result.success) {
        // The real-time subscription will handle message updates
        // No need to fetch messages again
      } else {
        setError(result.error || 'Failed to send message');
        // Remove the temporary message on error
        setMessages(prev => prev.filter(m => m.id !== tempMessage.id));
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
      // Remove the temporary message on error
      setMessages(prev => prev.filter(m => m.id !== tempMessage.id));
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    // We don't end the chat here, just minimize the widget
  };

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50 flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          aria-label="Open chat"
        >
          <MessageCircle className="w-8 h-8 text-white" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[650px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                {isStarted ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Headphones className="w-4 h-4" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-sm">
                  {isStarted ? `Chat with ${currentSession?.name || 'Customer'}` : 'Chat with us'}
                </h3>
                <p className="text-xs opacity-90">
                  {isStarted ? 'Conversation in progress' : 'We\'re here to help!'}
                </p>
              </div>
            </div>
            <div className="flex space-x-1">
              <div className="flex space-x-1">
                {isStarted && (
                  <button
                    onClick={handleEndChat}
                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                    title="End chat"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={handleClose}
                  className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                  title="Minimize chat"
                >
                  <span className="block w-5 h-1 bg-white rounded-full"></span>
                </button>
              </div>
            </div>
          </div>

          {/* Chat Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {!isStarted ? (
              /* Initial Form */
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-2" style={{ color: '#2C3E50' }}>
                    Get in touch
                  </h4>
                  <p className="text-sm opacity-70" style={{ color: '#2C3E50' }}>
                    Tell us your name, email, and how we can help you today.
                  </p>
                </div>

                <form onSubmit={handleStartChat} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#2C3E50' }}>
                      Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent text-sm"
                      style={{ 
                        borderColor: formErrors.name ? '#ef4444' : '#E87461',
                        '--tw-ring-color': '#E87461'
                      }}
                      placeholder="Your name"
                      disabled={isLoading}
                    />
                    {formErrors.name && (
                      <p className="mt-1 text-xs text-red-600">{formErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#2C3E50' }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent text-sm"
                      style={{ 
                        borderColor: formErrors.email ? '#ef4444' : '#E87461',
                        '--tw-ring-color': '#E87461'
                      }}
                      placeholder="your@email.com"
                      disabled={isLoading}
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-xs text-red-600">{formErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#2C3E50' }}>
                      How can we help? *
                    </label>
                    <textarea
                      value={formData.initialMessage}
                      onChange={(e) => setFormData(prev => ({ ...prev, initialMessage: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent text-sm resize-none"
                      style={{ 
                        borderColor: formErrors.initialMessage ? '#ef4444' : '#E87461',
                        '--tw-ring-color': '#E87461'
                      }}
                      placeholder="Tell us about your question or how we can assist you..."
                      rows={3}
                      disabled={isLoading}
                    />
                    {formErrors.initialMessage && (
                      <p className="mt-1 text-xs text-red-600">{formErrors.initialMessage}</p>
                    )}
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 text-white disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 hover:scale-105"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Starting chat...</span>
                      </div>
                    ) : (
                      'Start Chat'
                    )}
                  </button>
                </form>
              </div>
            ) : (
              /* Chat Interface */
              <>
                {/* Messages */}
                <div 
                  ref={messagesContainerRef} 
                  className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50"
                >
                  {messages.map((message) => (
                    <div
                      key={`${message.id}-${message.created_at}`}
                      className={`flex ${message.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] ${message.sender_type === 'user' ? 'order-2' : 'order-1'}`}>
                        <div
                          className={`px-4 py-2 rounded-lg ${
                            message.sender_type === 'user'
                              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                              : 'bg-white border border-gray-200'
                          }`}
                          style={{ color: message.sender_type === 'agent' ? '#2C3E50' : undefined }}
                        >
                          <p className="text-sm">{message.message_content}</p>
                        </div>
                        <div className={`flex items-center space-x-2 mt-1 ${message.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}>
                          {message.sender_type === 'agent' && (
                            <User className="w-3 h-3 opacity-50" style={{ color: '#2C3E50' }} />
                          )}
                          <span className="text-xs opacity-50" style={{ color: '#2C3E50' }}>
                            {formatMessageTime(message.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t bg-white">
                  {error && (
                    <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-xs text-red-700">
                        {error}
                        <button 
                          className="ml-2 text-red-600 underline"
                          onClick={() => setError(null)}
                        >
                          Dismiss
                        </button>
                      </p>
                    </div>
                  )}
                  
                  <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <input
                      ref={messageInputRef}
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent text-sm"
                      style={{ 
                        borderColor: '#E87461',
                        '--tw-ring-color': '#E87461'
                      } as React.CSSProperties}
                      placeholder="Type your message..."
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || isLoading}
                      className="px-3 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                    >
                      <Send className="w-4 h-4 text-white" />
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
          
          {/* Footer information */}
          {isStarted && (
            <div className="p-2 border-t bg-gray-50">
              <p className="text-xs opacity-60 text-center" style={{ color: '#2C3E50' }}>
                Your chat history will be saved if you refresh the page
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ChatWidget;