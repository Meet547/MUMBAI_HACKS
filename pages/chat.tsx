import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Send, Bot, User, MessageCircle, ArrowLeft, Settings, Trash2, RotateCcw } from 'lucide-react';

interface Message {
  id: number;
  sender_type: 'user' | 'ai';
  message: string;
  created_at: string;
}

interface ChatSession {
  id: number;
  title: string;
  created_at: string;
}

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('auth_token');
    const email = localStorage.getItem('user_email');
    
    if (!token) {
      router.push('/login');
      return;
    }
    
    setUserEmail(email || 'User');
    loadChatSessions();
  }, [router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatSessions = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:3000/api/chat/sessions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (data.success && data.sessions.length > 0) {
        setSessions(data.sessions);
        // Load the most recent session by default
        const recentSession = data.sessions[0];
        setCurrentSession(recentSession);
        loadSessionMessages(recentSession.id);
      } else {
        // Create a new session if none exist
        createNewSession();
      }
    } catch (error) {
      console.error('Failed to load chat sessions:', error);
      createNewSession();
    } finally {
      setIsLoadingSessions(false);
    }
  };

  const loadSessionMessages = async (sessionId: number) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:3000/api/chat/sessions/${sessionId}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Failed to load session messages:', error);
    }
  };

  const createNewSession = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      console.log('Creating new session...');
      console.log('Token exists:', !!token);
      
      const response = await fetch('http://localhost:3000/api/chat/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: `Chat ${new Date().toLocaleDateString()}` })
      });
      
      console.log('Create session response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Create session response:', data);
      
      if (data.success) {
        const newSession = data.session;
        setSessions(prev => [newSession, ...prev]);
        setCurrentSession(newSession);
        setMessages([{
          id: 0,
          sender_type: 'ai',
          message: 'Hello! I\'m your Draftzi AI assistant. I specialize in legal documents, compliance questions, and workflow automation. How can I help you today?',
          created_at: new Date().toISOString()
        }]);
      } else {
        throw new Error(data.message || 'Failed to create session');
      }
    } catch (error) {
      console.error('Failed to create new session:', error);
      alert('Failed to create new chat session. Please check your connection and try again.');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentSession || isLoading) return;
    
    const userMessage = newMessage;
    setNewMessage('');
    setIsLoading(true);
    
    // Add user message immediately to UI
    const tempUserMessage = {
      id: Date.now(),
      sender_type: 'user' as const,
      message: userMessage,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMessage]);
    
    try {
      const token = localStorage.getItem('auth_token');
      console.log('Sending message to:', `http://localhost:3000/api/chat/messages`);
      console.log('Session ID:', currentSession.id);
      console.log('Token exists:', !!token);
      
      const response = await fetch('http://localhost:3000/api/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          session_id: currentSession.id,
          message: userMessage
        })
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.success) {
        // Remove the temp message and add the real messages from server
        setMessages(prev => {
          const withoutTemp = prev.slice(0, -1); // Remove temp message
          return [...withoutTemp, ...data.messages];
        });
      } else {
        throw new Error(data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      // Show error to user
      const errorMessage = {
        id: Date.now() + 1,
        sender_type: 'ai' as const,
        message: 'Sorry, I encountered an error. Please try again.',
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const deleteSession = async (sessionId: number) => {
    if (sessions.length <= 1) return; // Don't delete the last session
    
    try {
      const token = localStorage.getItem('auth_token');
      await fetch(`http://localhost:3000/api/chat/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      
      if (currentSession?.id === sessionId) {
        const remainingSessions = sessions.filter(s => s.id !== sessionId);
        if (remainingSessions.length > 0) {
          const newSession = remainingSessions[0];
          setCurrentSession(newSession);
          loadSessionMessages(newSession.id);
        }
      }
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  };

  if (isLoadingSessions) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex animate-fade-in">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col animate-slide-in-left">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 animate-fade-in-delay">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.push('/')}
              className="flex items-center text-gray-600 hover:text-blue-600 transition-all duration-300 hover:transform hover:translate-x-1"
            >
              <ArrowLeft className="w-5 h-5 mr-2 transition-transform duration-300" />
              Back to Home
            </button>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2 animate-fade-in-delay-2">Draftzi AI</h1>
          <p className="text-sm text-gray-600 animate-fade-in-delay-3">Welcome back, {userEmail}</p>
        </div>

        {/* New Chat Button */}
        <div className="p-4 border-b border-gray-100 animate-fade-in-delay-4">
          <button
            onClick={createNewSession}
            className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center transform hover:scale-105 hover:shadow-lg"
          >
            <MessageCircle className="w-5 h-5 mr-2 transition-transform duration-300" />
            New Chat
          </button>
        </div>

        {/* Chat Sessions */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 animate-fade-in-delay-5">Recent Chats</h3>
            <div className="space-y-2">
              {sessions.map((session, index) => (
                <div
                  key={session.id}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-300 group transform hover:scale-102 ${
                    currentSession?.id === session.id
                      ? 'bg-blue-50 border border-blue-200 shadow-sm'
                      : 'hover:bg-gray-50 border border-transparent hover:shadow-sm'
                  }`}
                  style={{
                    animationDelay: `${(index * 0.1) + 0.6}s`
                  }}
                  onClick={() => {
                    setCurrentSession(session);
                    loadSessionMessages(session.id);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate transition-colors duration-300 ${
                        currentSession?.id === session.id ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {session.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(session.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {sessions.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSession(session.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all duration-300 transform hover:scale-110"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 animate-fade-in-delay-6">
          <div className="text-xs text-gray-500 text-center">
            Draftzi AI Assistant v1.0<br />
            Powered by advanced AI
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col animate-slide-in-right">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 animate-fade-in-delay">
          <div className="flex items-center justify-between">
            <div className="animate-fade-in-delay-2">
              <h2 className="text-xl font-semibold text-gray-900">
                {currentSession?.title || 'Chat'}
              </h2>
              <p className="text-sm text-gray-600">
                Ask me about legal documents, compliance, or workflow automation
              </p>
              {process.env.NODE_ENV === 'development' && (
                <p className="text-xs text-blue-600">
                  Session: {currentSession?.id || 'None'} | Backend: {typeof window !== 'undefined' ? 'Connected' : 'Loading'}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2 animate-fade-in-delay-3">
              <button
                onClick={() => createNewSession()}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 transform hover:scale-110"
                title="New Chat"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 animate-fade-in-delay-4">
          {messages.map((message, index) => (
            <div 
              key={message.id || index} 
              className={`flex ${message.sender_type === 'user' ? 'justify-end' : 'justify-start'} animate-message-appear`}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div className={`max-w-3xl flex ${message.sender_type === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  message.sender_type === 'user' 
                    ? 'bg-blue-600 text-white ml-3 hover:bg-blue-700' 
                    : 'bg-gray-100 text-gray-600 mr-3 hover:bg-gray-200'
                }`}>
                  {message.sender_type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Content */}
                <div className={`rounded-2xl px-4 py-3 transition-all duration-300 hover:shadow-md ${
                  message.sender_type === 'user'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-white border border-gray-200 text-gray-900 hover:border-gray-300'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.message}</p>
                  <p className={`text-xs mt-2 ${
                    message.sender_type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {new Date(message.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <div className="max-w-3xl flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-6 animate-slide-in-up">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about legal documents, compliance, contracts, or anything else..."
                  className="w-full resize-none border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300"
                  rows={newMessage.split('\n').length || 1}
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Press Enter to send, Shift+Enter for new line
                </p>
              </div>
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim() || isLoading}
                className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes messageAppear {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .animate-fade-in-delay {
          animation: fadeIn 0.6s ease-out 0.2s forwards;
          opacity: 0;
        }

        .animate-fade-in-delay-2 {
          animation: fadeIn 0.6s ease-out 0.3s forwards;
          opacity: 0;
        }

        .animate-fade-in-delay-3 {
          animation: fadeIn 0.6s ease-out 0.4s forwards;
          opacity: 0;
        }

        .animate-fade-in-delay-4 {
          animation: fadeIn 0.6s ease-out 0.5s forwards;
          opacity: 0;
        }

        .animate-fade-in-delay-5 {
          animation: fadeIn 0.6s ease-out 0.6s forwards;
          opacity: 0;
        }

        .animate-fade-in-delay-6 {
          animation: fadeIn 0.6s ease-out 0.7s forwards;
          opacity: 0;
        }

        .animate-slide-in-left {
          animation: slideInLeft 0.8s ease-out forwards;
        }

        .animate-slide-in-right {
          animation: slideInRight 0.8s ease-out 0.1s forwards;
          opacity: 0;
        }

        .animate-slide-in-up {
          animation: slideInUp 0.6s ease-out 0.8s forwards;
          opacity: 0;
        }

        .animate-message-appear {
          animation: messageAppear 0.5s ease-out forwards;
        }

        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }

        .hover\\:scale-105:hover {
          transform: scale(1.05);
        }

        .hover\\:scale-110:hover {
          transform: scale(1.10);
        }
      `}</style>
    </div>
  );
}