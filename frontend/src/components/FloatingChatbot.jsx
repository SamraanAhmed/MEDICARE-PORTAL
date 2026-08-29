import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { MessageSquare, X, Send, Bot, User, Sparkles, RefreshCw, ShieldAlert } from 'lucide-react';

const FloatingChatbot = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Load chat history on mount or user change
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await api.getChatHistory();
        if (!history || history.length === 0) {
          const welcome = {
            sender: 'bot',
            content: `Hello ${user ? user.name : 'Guest'}! I am your MediCare AI Health Assistant. Ask me anything about our clinics, specialized services, doctor availability, or symptom screening guidelines.`,
            created_at: new Date(),
          };
          setMessages([welcome]);
          api.sendDirectMessage('bot', welcome.content);
        } else {
          setMessages(history);
        }
      } catch (err) {
        console.error("Failed to load chat history in floating chatbot:", err);
      }
    };
    fetchHistory();
  }, [user, isOpen]); // Reload history when opened or user changes

  // Auto-scroll to bottom
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, isOpen]);

  // Listen for custom event to open chatbot widget in-place
  useEffect(() => {
    const handleOpenChatbot = () => {
      setIsOpen(true);
    };
    window.addEventListener('open-chatbot', handleOpenChatbot);
    return () => {
      window.removeEventListener('open-chatbot', handleOpenChatbot);
    };
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;

    const userMessageText = inputValue.trim();
    setInputValue('');

    // Add user message to state
    const userMsgObj = { sender: 'user', content: userMessageText, created_at: new Date() };
    setMessages((prev) => [...prev, userMsgObj]);

    setLoading(true);
    try {
      if (user) {
        // Send to real chatbot API endpoint (requires authentication)
        const botResponse = await api.askChatbot(userMessageText);
        setMessages((prev) => [
          ...prev,
          { sender: 'bot', content: botResponse, created_at: new Date() }
        ]);
      } else {
        // Mock response if guest access
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const botMock = "I am a medical assistant bot. Please Sign In to verify credentials and access the full AI-powered diagnostic assistant.";
        setMessages((prev) => [
          ...prev,
          { sender: 'bot', content: botMock, created_at: new Date() }
        ]);
        api.sendDirectMessage('user', userMessageText);
        api.sendDirectMessage('bot', botMock);
      }
    } catch (err) {
      const errorMsg = err.message || "My diagnostic servers are currently busy. Please verify your authentication session.";
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', content: `[Error]: ${errorMsg}`, created_at: new Date() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    localStorage.removeItem('medicare_messages');
    const welcome = {
      sender: 'bot',
      content: `Hello ${user ? user.name : 'Guest'}! Let's start fresh. How can I assist you with your health today?`,
      created_at: new Date(),
    };
    setMessages([welcome]);
    api.sendDirectMessage('bot', welcome.content);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-body">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center w-20 h-20 bg-transparent hover:scale-110 transition-all duration-300 relative group cursor-pointer overflow-hidden filter drop-shadow-[0_12px_12px_rgba(0,0,0,0.65)] animate-float"
          title="AI Health Assistant"
        >
          <img 
            src="/imgvid/medicarechatbot.png" 
            alt="AI Assistant" 
            className="w-full h-full object-contain"
          />
        </button>
      )}

      {/* Expandable Chat Card */}
      {isOpen && (
        <div className="w-96 max-w-[calc(100vw-2rem)] h-[500px] flex flex-col bg-white border border-slate-100 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 animate-in slide-in-from-bottom-5 fade-in">
          {/* Header */}
          <div className="bg-teal-800 text-white p-4 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 flex items-center justify-center font-bold text-white relative">
                <img 
                  src="/imgvid/medicarechatbot.png" 
                  alt="AI Assistant Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-left font-sans">
                <h3 className="text-sm font-extrabold flex items-center gap-1 font-heading text-white">
                  AI Advisor
                </h3>
                <p className="text-[10px] text-teal-100">Virtual Screening desk • HIPAA Compliant</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                className="p-1.5 rounded-lg text-teal-200 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                title="Reset Chat"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-teal-200 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                title="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div 
            data-lenis-prevent
            className="flex-1 bg-slate-50 overflow-y-auto p-4 space-y-3.5 flex flex-col justify-start"
          >
            {messages.map((msg, i) => {
              const isBot = msg.sender === 'bot';
              return (
                <div
                  key={i}
                  className={`flex items-start gap-2.5 max-w-[85%] animate-in fade-in duration-200 ${
                    isBot ? 'self-start text-left' : 'self-end flex-row-reverse text-right'
                  }`}
                >
                  <div
                    className={`w-7 h-7 shrink-0 text-[10px] font-bold flex items-center justify-center ${
                      isBot 
                        ? '' 
                        : 'rounded-full overflow-hidden border bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    {isBot ? (
                      <img 
                        src="/imgvid/medicarechatbot.png" 
                        alt="Bot" 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <User className="w-3.5 h-3.5" />
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <div
                      className={`px-3 py-2 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                        isBot
                          ? 'bg-white text-slate-800 rounded-tl-xs shadow-xs border border-slate-100'
                          : 'bg-teal-800 text-white rounded-tr-xs shadow-xs'
                      }`}
                    >
                      {msg.content}
                    </div>
                    <span className="text-[8px] text-slate-400 block px-1">
                      {new Date(msg.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-start gap-2.5 max-w-[80%] self-start text-left animate-in fade-in duration-200">
                <div className="w-7 h-7 flex items-center justify-center shrink-0">
                  <img 
                    src="/imgvid/medicarechatbot.png" 
                    alt="Bot Loading" 
                    className="w-full h-full object-contain animate-pulse"
                  />
                </div>
                <div className="bg-white border border-slate-100 shadow-xs px-4 py-2.5 rounded-2xl rounded-tl-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-bounce delay-100"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-bounce delay-200"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-bounce delay-300"></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Guest prompt overlay if not signed in */}
          {!user && (
            <div className="bg-amber-50 border-t border-amber-100 p-3 flex flex-col gap-2 shrink-0 text-left">
              <div className="flex items-center gap-2 text-[10px] text-amber-800 font-semibold leading-normal">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                <p>Sign In to connect with our live Gemini diagnostic assistant.</p>
              </div>
              <Link
                to="/auth"
                onClick={() => setIsOpen(false)}
                className="w-full py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold text-center transition-colors"
              >
                Sign In Now
              </Link>
            </div>
          )}

          {/* Input form */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 bg-white flex gap-2 shrink-0">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your symptoms or questions..."
              className="flex-grow px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:outline-hidden focus:ring-1 focus:ring-teal-700 focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || loading}
              className="px-4 bg-teal-800 hover:bg-teal-900 text-white rounded-xl font-bold shadow-md transition-colors flex items-center justify-center shrink-0 cursor-pointer disabled:bg-slate-200 disabled:shadow-none"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default FloatingChatbot;
