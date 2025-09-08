import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { toast, ToastContainer } from 'react-toastify';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import api from '../api.js';
import 'react-toastify/dist/ReactToastify.css';
import { FiSend, FiUser, FiMessageSquare, FiZap, FiHeart, FiAward } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const AICoachPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [sessionStats, setSessionStats] = useState(null);
  const [coachMood, setCoachMood] = useState('default');
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const { width, height } = useWindowSize();
  const { user } = useAuth();

  useEffect(() => { 
    scrollToBottom(); 
  }, [messages]);

  const scrollToBottom = () => { 
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); 
  };

  useEffect(() => {
    if (user) {
      const savedMessages = localStorage.getItem(`chatHistory_${user.id}`);
      if (savedMessages && JSON.parse(savedMessages).length > 0) {
        setMessages(JSON.parse(savedMessages).map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      } else {
        setMessages([
          { 
            sender: 'ai', 
            text: "Hello! I'm your personal mindset coach. What's on your mind today?",
            timestamp: new Date(),
            id: Date.now()
          }
        ]);
      }

      const savedStats = localStorage.getItem(`sessionStats_${user.id}`);
      if (savedStats) {
        setSessionStats(JSON.parse(savedStats));
      } else {
        setSessionStats({ messagesExchanged: 0, positiveSentiment: 0, insightsGained: 0 });
      }
    }
  }, [user]);

  useEffect(() => {
    if (user && messages.length > 0) {
      localStorage.setItem(`chatHistory_${user.id}`, JSON.stringify(messages));
    }
  }, [messages, user]);

  useEffect(() => {
    if (user && sessionStats !== null) {
      localStorage.setItem(`sessionStats_${user.id}`, JSON.stringify(sessionStats));
    }
  }, [sessionStats, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() === '' || isLoading) return;

    const userMessage = { 
      sender: 'user', 
      text: input, 
      timestamp: new Date(), 
      id: Date.now() 
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    setSessionStats(prev => ({ 
      ...prev, 
      messagesExchanged: prev.messagesExchanged + 1 
    }));

    try {
      const { data } = await api.post('/coach', { 
        message: input,
        history: messages
      });
      
      const aiMessage = { 
        sender: 'ai', 
        text: data.response, 
        timestamp: new Date(), 
        id: Date.now() 
      };
      
      if (data.sentiment === 'positive') {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
        setSessionStats(prev => ({ 
          ...prev, 
          positiveSentiment: prev.positiveSentiment + 1 
        }));
        toast.success('Great mindset! Keep it up!', { position: 'bottom-right', autoClose: 3000 });
      }
      
      if (data.isInsight) {
        setSessionStats(prev => ({ 
          ...prev, 
          insightsGained: prev.insightsGained + 1 
        }));
        toast.info('✨ New Insight Gained!', { position: 'bottom-right', autoClose: 3000 });
      }
      
      setCoachMood(data.mood || 'default');
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI Coach failed to respond:", error);
      const errorMessage = { 
        sender: 'ai', 
        text: "I'm having trouble connecting. Please try again.", 
        timestamp: new Date(), 
        id: Date.now() 
      };
      setMessages(prev => [...prev, errorMessage]);
      toast.error('Connection issue. Please try again.', { position: 'bottom-right', autoClose: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  const clearChatHistory = () => {
    if (user) {
      localStorage.removeItem(`chatHistory_${user.id}`);
      localStorage.removeItem(`sessionStats_${user.id}`);
      setMessages([
        { 
          sender: 'ai', 
          text: "Hello! I'm your personal mindset coach. What's on your mind today?",
          timestamp: new Date(),
          id: Date.now()
        }
      ]);
      setSessionStats({ messagesExchanged: 0, positiveSentiment: 0, insightsGained: 0 });
      toast.info('Chat history cleared!', { position: 'bottom-right', autoClose: 2000 });
    }
  };

  const getCoachAvatar = () => {
    switch(coachMood) {
      case 'happy': 
        return <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-xl">😊</div>;
      case 'excited': 
        return <div className="w-10 h-10 rounded-full bg-green-400 flex items-center justify-center text-xl">🤩</div>;
      case 'thoughtful': 
        return <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-xl">🤔</div>;
      case 'supportive': 
        return <div className="w-10 h-10 rounded-full bg-purple-400 flex items-center justify-center text-xl">💪</div>;
      default: 
        return <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center text-white"><FiMessageSquare /></div>;
    }
  };

  const formatTime = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} gravity={0.2} />}
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />
      
      <div className="flex-grow p-4 sm:p-6 max-w-7xl mx-auto w-full pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
          <div className="lg:col-span-1 space-y-6 hidden lg:flex flex-col">
            <div className="bg-slate-800/70 rounded-xl p-6 backdrop-blur-sm border border-slate-700/50 shadow-lg flex-grow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <FiZap className="text-yellow-400" />
                  Session Stats
                </h3>
                <button 
                  onClick={clearChatHistory}
                  className="text-xs text-slate-400 hover:text-white transition-colors"
                  title="Clear chat history"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-4">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Messages</span>
                    <span className="text-white font-bold">{sessionStats?.messagesExchanged || 0}</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2 mt-2">
                    <div 
                      className="bg-sky-500 h-2 rounded-full" 
                      style={{ width: `${Math.min((sessionStats?.messagesExchanged || 0) * 10, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Positive Moments</span>
                    <span className="text-white font-bold">{sessionStats?.positiveSentiment || 0}</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2 mt-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${Math.min((sessionStats?.positiveSentiment || 0) * 20, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Insights Gained</span>
                    <span className="text-white font-bold">{sessionStats?.insightsGained || 0}</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2 mt-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full" 
                      style={{ width: `${Math.min((sessionStats?.insightsGained || 0) * 25, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/70 rounded-xl p-6 backdrop-blur-sm border border-slate-700/50 shadow-lg">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FiAward className="text-amber-400" />
                Achievements
              </h3>
              <div className="space-y-3">
                <div className={`flex items-center gap-3 p-3 rounded-lg ${(sessionStats?.messagesExchanged || 0) >= 5 ? 'bg-amber-900/30 border border-amber-700/50' : 'bg-slate-700/30'}`}>
                  <div className={`p-2 rounded-full ${(sessionStats?.messagesExchanged || 0) >= 5 ? 'bg-amber-500 text-white' : 'bg-slate-600 text-slate-400'}`}>
                    <FiMessageSquare />
                  </div>
                  <div>
                    <h4 className={`font-medium ${(sessionStats?.messagesExchanged || 0) >= 5 ? 'text-amber-300' : 'text-slate-400'}`}>
                      Conversation Starter
                    </h4>
                    <p className="text-xs text-slate-400">
                      {(sessionStats?.messagesExchanged || 0) >= 5 ? 'Unlocked!' : 'Send 5 messages'}
                    </p>
                  </div>
                </div>
                <div className={`flex items-center gap-3 p-3 rounded-lg ${(sessionStats?.positiveSentiment || 0) >= 3 ? 'bg-emerald-900/30 border border-emerald-700/50' : 'bg-slate-700/30'}`}>
                  <div className={`p-2 rounded-full ${(sessionStats?.positiveSentiment || 0) >= 3 ? 'bg-emerald-500 text-white' : 'bg-slate-600 text-slate-400'}`}>
                    <FiHeart />
                  </div>
                  <div>
                    <h4 className={`font-medium ${(sessionStats?.positiveSentiment || 0) >= 3 ? 'text-emerald-300' : 'text-slate-400'}`}>
                      Positive Thinker
                    </h4>
                    <p className="text-xs text-slate-400">
                      {(sessionStats?.positiveSentiment || 0) >= 3 ? 'Unlocked!' : '3 positive responses'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 flex flex-col h-full">
            <div className="text-center mb-6">
              <motion.h2 
                className="text-3xl font-bold text-white" 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5 }}
              >
                AI Mindset Coach
              </motion.h2>
              <motion.p 
                className="text-slate-300" 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                A safe space to untangle your thoughts. Your conversation is private.
              </motion.p>
            </div>

            <div 
              ref={chatContainerRef} 
              className="flex-grow bg-slate-800/50 rounded-xl p-6 overflow-y-auto mb-4 space-y-6 backdrop-blur-sm border border-slate-700/50 shadow-lg" 
              style={{ maxHeight: 'calc(100vh - 220px)' }}
            >
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div 
                    key={msg.id} 
                    initial={{ opacity: 0, y: msg.sender === 'user' ? 20 : -20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.3 }} 
                    className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.sender === 'ai' && (
                      <div className="flex-shrink-0">
                        {getCoachAvatar()}
                      </div>
                    )}
                    <div className={`max-w-lg px-4 py-3 rounded-2xl relative ${msg.sender === 'user' ? 'bg-sky-600 text-white rounded-br-none' : 'bg-slate-700 text-slate-200 rounded-bl-none'}`}>
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                      <div className={`text-xs mt-1 text-right ${msg.sender === 'user' ? 'text-sky-200' : 'text-slate-400'}`}>
                        {formatTime(msg.timestamp)}
                      </div>
                      {msg.sender === 'user' && (
                        <div className="absolute -bottom-3 right-0">
                          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 0H0V15C0 15 2.5 10 7.5 10C12.5 10 15 15 15 15V0Z" fill="#0284c7"/>
                          </svg>
                        </div>
                      )}
                      {msg.sender === 'ai' && (
                        <div className="absolute -bottom-3 left-0">
                          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 0H15V15C15 15 12.5 10 7.5 10C2.5 10 0 15 0 15V0Z" fill="#334155"/>
                          </svg>
                        </div>
                      )}
                    </div>
                    {msg.sender === 'user' && (
                      <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-white flex-shrink-0">
                        <FiUser />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="flex items-end gap-3 justify-start"
                >
                  <div className="flex-shrink-0">
                    {getCoachAvatar()}
                  </div>
                  <div className="bg-slate-700 text-slate-200 rounded-2xl rounded-bl-none px-4 py-3">
                    <div className="flex items-center gap-1 min-w-[60px]">
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-0"></span>
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-200"></span>
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-400"></span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <motion.form 
              onSubmit={handleSubmit} 
              className="flex gap-4 mt-auto" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.3 }}
            >
              <input 
                type="text" 
                className="flex-grow p-4 bg-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 caret-sky-500 border border-slate-600 shadow-lg transition-all duration-200 hover:border-slate-500" 
                placeholder="Type your thoughts here..." 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
              />
              <button 
                type="submit" 
                disabled={isLoading} 
                className="relative bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold py-2 px-6 rounded-xl hover:from-sky-600 hover:to-blue-700 transition-all duration-300 shadow-lg disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed group flex items-center gap-2 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <FiSend className="transition-transform group-hover:translate-x-1" />
                  <span>Send</span>
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-sky-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></span>
              </button>
            </motion.form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICoachPage;

