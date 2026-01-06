
import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../hooks/useChat';
import { ChatMessage } from '../types';

// Simple rule-based responses for optical shop
const getOpticalResponse = (userMessage: string): string => {
  const message = userMessage.toLowerCase();
  
  // Greetings
  if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
    return "Hello! Welcome to MSV Eyeworks. How can I help you find the perfect eyewear today?";
  }
  
  // Product inquiries
  if (message.includes('frame') || message.includes('glasses') || message.includes('eyeglasses')) {
    return "We offer a wide range of high-quality frames including designer brands, sports frames, and everyday options. Would you like to see our current collection?";
  }
  
  if (message.includes('sunglass') || message.includes('sun') || message.includes('shade')) {
    return "Our sunglasses collection includes polarized and UV-protective options from top brands. We have both fashion and performance sunglasses available.";
  }
  
  if (message.includes('contact') || message.includes('lens')) {
    return "We provide contact lenses from major brands including daily, monthly, and extended wear options. Our optometrists can help you find the perfect fit.";
  }
  
  // Services
  if (message.includes('appointment') || message.includes('schedule') || message.includes('book')) {
    return "I can help you schedule an eye exam or fitting appointment. Our optometrists are available Monday through Saturday. Would you like to book a specific time?";
  }
  
  if (message.includes('eye exam') || message.includes('checkup') || message.includes('test')) {
    return "Our comprehensive eye exams include vision testing, eye health screening, and prescription updates. The exam takes about 30-45 minutes.";
  }
  
  // Pricing and location
  if (message.includes('price') || message.includes('cost') || message.includes('how much')) {
    return "Our prices vary by brand and type of eyewear. We have options ranging from budget-friendly to premium designer frames. Would you like information about a specific price range?";
  }
  
  if (message.includes('location') || message.includes('address') || message.includes('where')) {
    return "MSV Eyeworks is located in Rizal. We're open Monday-Saturday from 9 AM to 5 PM (closed Sundays). Would you like directions or our exact address?";
  }
  
  // Brand inquiries
  if (message.includes('ray-ban') || message.includes('oakley') || message.includes('gucci')) {
    return "Yes, we carry designer brands including Ray-Ban, Oakley, Gucci, and many more. All our designer eyewear comes with authenticity guarantee.";
  }
  
  // Help and support
  if (message.includes('help') || message.includes('assist') || message.includes('support')) {
    return "I'm here to help! You can ask me about our products, services, appointments, pricing, or any other questions about MSV Eyeworks.";
  }
  
  // Default responses
  if (message.includes('thank') || message.includes('thanks')) {
    return "You're welcome! Is there anything else I can help you with today?";
  }
  
  if (message.includes('bye') || message.includes('goodbye')) {
    return "Thank you for visiting MSV Eyeworks! Feel free to reach out anytime. Have a great day!";
  }
  
  // Fallback response
  return "Thank you for your message! For specific product inquiries or to schedule an appointment, you can call our store directly or visit us in Rizal. Our staff will be happy to assist you personally.";
};

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [userName, setUserName] = useState('');
  const [isNameSet, setIsNameSet] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Use real-time chat hook
  const { 
    messages, 
    isLoading, 
    isConnected, 
    sessionId,
    sendUserMessage, 
    sendAssistantMessage,
    sendAdminMessage
  } = useChat();

  // Check if user name is stored
  useEffect(() => {
    const storedName = localStorage.getItem('chat_user_name');
    if (storedName) {
      setUserName(storedName);
      setIsNameSet(true);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSetName = () => {
    if (userName.trim()) {
      localStorage.setItem('chat_user_name', userName.trim());
      setIsNameSet(true);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    console.log('📤 Sending message:', inputValue);
    
    // Send user message through Supabase with user name
    try {
      await sendUserMessage(inputValue, userName);
      console.log('✅ User message sent successfully');
    } catch (error) {
      console.error('❌ Failed to send user message:', error);
      // Add message locally as fallback
      return;
    }
    
    const userMessage = inputValue;
    setInputValue('');

    // Only send automated response if this is the very first message (no previous messages)
    if (messages.length === 0) {
      // Get rule-based response and send as assistant message
      try {
        // Add small delay to simulate thinking
        await new Promise(resolve => setTimeout(resolve, 800));
        const responseText = getOpticalResponse(userMessage);
        console.log('🤖 Generated initial response:', responseText);
        
        await sendAssistantMessage(responseText);
        console.log('✅ Initial assistant message sent successfully');
      } catch (error) {
        console.error('❌ Failed to send assistant message:', error);
        // Send fallback message
        try {
          await sendAssistantMessage('Thank you for your message! Our team will get back to you soon.');
        } catch (fallbackError) {
          console.error('❌ Failed to send fallback message:', fallbackError);
        }
      }
    } else {
      // For subsequent messages, show waiting message instead of automated response
      try {
        await sendAssistantMessage('Thank you for your message! Please wait while our team reviews your request...');
        console.log('✅ Waiting message sent successfully');
      } catch (error) {
        console.error('❌ Failed to send waiting message:', error);
      }
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[120]">
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl hover:bg-blue-700 transition-all transform hover:scale-110 active:scale-90 relative overflow-hidden group ${isOpen ? 'rotate-90' : ''}`}
      >
        <div className="absolute inset-0 shimmer opacity-20"></div>
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[380px] h-[580px] bg-white rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden border border-slate-100 animate-in slide-in-from-bottom-8 zoom-in-95 duration-300">
          <div className="bg-blue-600 p-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-blue-600 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
              </div>
              <div>
                <h3 className="text-white font-bold text-base leading-tight">MSV AI Assistant</h3>
                <p className="text-blue-200 text-xs font-black uppercase tracking-widest mt-0.5">
                  {isNameSet ? userName : 'Guest'} • Rizal Flagship
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white transition-colors p-2">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Name Input Modal */}
          {!isNameSet && (
            <div className="bg-blue-50 border-b border-blue-100 p-4">
              <div className="text-center mb-3">
                <label htmlFor="user-name-input" className="text-sm font-bold text-blue-700 uppercase tracking-wide">Welcome to MSV Eyeworks!</label>
                <p className="text-blue-700 text-xs mt-1">Please tell us your name to get started</p>
              </div>
              <div className="flex gap-2">
                <input 
                  type="text"
                  id="user-name-input"
                  name="user-name-input"
                  autoComplete="name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSetName()}
                  placeholder="Enter your name"
                  className="flex-1 px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  maxLength={50}
                />
                <button 
                  onClick={handleSetName}
                  disabled={!userName.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Start Chat
                </button>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4" ref={scrollRef}>
            {/* Show welcome message if no messages */}
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <p className="text-slate-600 font-medium">Hello! I am your MSV Eyeworks Assistant.</p>
                <p className="text-slate-500 text-sm mt-1">How can I help you with your eyewear journey today?</p>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                  <span className="text-xs text-slate-500">
                    {isConnected ? 'Connected' : 'Connecting...'}
                  </span>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : message.role === 'admin'
                      ? 'bg-orange-500 text-white border-2 border-orange-600'
                      : 'bg-slate-100 text-slate-900 border border-slate-200'
                  }`}
                >
                  {/* Show user name for user and admin messages */}
                  {(message.role === 'user' || message.role === 'admin') && message.user_name && (
                    <div className={`text-xs font-bold mb-1 ${
                      message.role === 'admin' ? 'text-orange-100' : 'opacity-90'
                    }`}>
                      {message.user_name} {message.role === 'admin' && '👤'}
                    </div>
                  )}
                  
                  <div className="text-sm font-medium break-words">
                    {message.message}
                  </div>
                  
                  <div className={`text-xs mt-1 ${
                    message.role === 'user' 
                      ? 'text-blue-100' 
                      : message.role === 'admin'
                      ? 'text-orange-100'
                      : 'text-slate-500'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start animate-in fade-in duration-300">
                <div className="bg-slate-100 text-slate-900 border border-slate-200 rounded-2xl px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-white border-t border-slate-100">
            <div className="relative flex items-center gap-2">
              <input 
                type="text"
                id="chat-input"
                name="chat-input"
                autoComplete="off"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={isNameSet ? "Ask about brands or exams..." : "Please set your name first..."}
                className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-600 transition-all outline-none pr-12 focus:bg-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isNameSet}
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !inputValue.trim() || !isNameSet}
                className="absolute right-2 bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-30 transition-all active:scale-90 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            {!isNameSet && (
              <p className="text-xs text-slate-500 mt-2 text-center">
                Please enter your name above to start chatting with our assistant
              </p>
            )}
          </div>
          <p className="text-[9px] text-center text-slate-400 mt-4 font-black uppercase tracking-[0.2em]">
              Rizal Flagship • Professional Clinical Support
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
