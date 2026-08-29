import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Send, Bot, User, ShieldAlert, Sparkles, MessageSquare, RefreshCw } from 'lucide-react';

const Chat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await api.getChatHistory();
        if (history.length === 0) {
          // Seed initial welcoming message
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
        console.error("Failed to load chat history:", err);
      }
    };
    if (user) {
      fetchHistory();
    }
  }, [user]);

  // Autoscroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

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

  // Redirect block if not signed in
  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="section-header-anim text-center space-y-2 shrink-0">
          <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-800 flex items-center justify-center mx-auto border border-teal-100">
            <Bot className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black text-teal-950 font-heading">AI Medical Consultation</h2>
        </div>
        <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
          Access to our AI-powered telehealth advisor is restricted to registered patients. Please sign in to establish a session.
        </p>
        <div className="pt-2">
          <Link
            to="/auth"
            className="px-8 py-3.5 bg-teal-850 hover:bg-teal-900 text-white font-bold rounded-xl shadow-md transition-colors"
          >
            Access Sign In Portal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 h-[calc(100vh-100px)] min-h-[500px] flex flex-col space-y-4">
      
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-xs flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-800 text-white flex items-center justify-center font-bold">
            <Bot className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5 font-heading">
              MediCare AI Advisor
            </h3>
            <p className="text-[10px] text-slate-400">Virtual Screening desk • HIPAA Compliant</p>
          </div>
        </div>

        <button
          onClick={handleResetChat}
          className="p-2 rounded-xl text-slate-400 hover:text-teal-800 hover:bg-slate-50 transition-all cursor-pointer flex items-center gap-1 text-xs font-semibold"
          title="Reset Conversations"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="hidden sm:inline">Reset Chat</span>
        </button>
      </div>

      {/* Main Conversation Canvas */}
      <div 
        data-lenis-prevent
        className="flex-1 bg-white rounded-3xl border border-slate-100 p-6 overflow-y-auto space-y-4 shadow-xs flex flex-col justify-start"
      >
        
        {messages.map((msg, i) => {
          const isBot = msg.sender === 'bot';
          return (
            <div
              key={i}
              className={`flex items-start gap-3.5 max-w-[85%] sm:max-w-[70%] animate-in fade-in duration-200 ${
                isBot ? 'self-start text-left' : 'self-end flex-row-reverse text-right'
              }`}
            >
              {/* Avatar circle */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border text-xs font-bold ${
                  isBot 
                    ? 'bg-teal-50 border-teal-100 text-teal-800' 
                    : 'bg-emerald-50 border-emerald-100 text-emerald-800'
                }`}
              >
                {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Message bubble */}
              <div className="space-y-1">
                <div
                  className={`px-4.5 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    isBot
                      ? 'bg-slate-100 text-slate-800 rounded-tl-xs'
                      : 'bg-teal-800 text-white rounded-tr-xs'
                  }`}
                >
                  {msg.content}
                </div>
                <span className="text-[9px] text-slate-400 block px-1">
                  {new Date(msg.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}

        {/* Loading bubble */}
        {loading && (
          <div className="flex items-start gap-3.5 max-w-[70%] self-start text-left animate-in fade-in duration-200">
            <div className="w-8 h-8 rounded-full bg-teal-50 border border-teal-100 text-teal-800 flex items-center justify-center shrink-0 text-xs">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className="bg-slate-100 px-5 py-3.5 rounded-2xl rounded-tl-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce delay-100"></span>
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce delay-200"></span>
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce delay-300"></span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Tray */}
      <form onSubmit={handleSendMessage} className="flex gap-2 shrink-0">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask AI Assistant (e.g. Symptoms of high cholesterol, available cardiologists...)"
          className="flex-grow px-5 py-4 rounded-2xl border border-slate-200 bg-white text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-700 shadow-xs"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || loading}
          className="px-6 py-4 bg-teal-850 hover:bg-teal-900 text-white rounded-2xl font-bold shadow-md hover:shadow-lg transition-colors flex items-center justify-center shrink-0 cursor-pointer disabled:bg-slate-200 disabled:shadow-none"
        >
          <Send className="w-4.5 h-4.5" />
        </button>
      </form>

      {/* Disclaimer warning */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-2 text-[10px] text-slate-500 leading-normal text-left shrink-0">
        <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
        <p>
          <strong>Disclaimer:</strong> MediCare AI Advisor suggestions represent standard screening guidelines, not direct diagnoses. Always consult our licensed specialist doctors for primary clinical checks.
        </p>
      </div>

    </div>
  );
};

export default Chat;
