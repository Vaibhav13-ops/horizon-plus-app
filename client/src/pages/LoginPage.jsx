import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { useAuth } from '../hooks/useAuth';
import api from '../api.js';
import { FiMail, FiLock, FiLogIn, FiBriefcase, FiUser } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const inspirationalQuotes = [
  { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { quote: "The best way to predict the future is to create it.", author: "Abraham Lincoln" },
];

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [quoteIndex, setQuoteIndex] = useState(0);
  const { login } = useAuth();
  
  const [searchParams] = useSearchParams();
  const isConsultantLogin = searchParams.get('role') === 'consultant';

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((prevIndex) => (prevIndex + 1) % inspirationalQuotes.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const particlesInit = useCallback(async engine => {
    await loadSlim(engine);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      
      const expectedRole = isConsultantLogin ? 'consultant' : 'user';
      const loginData = { email, password, expectedRole };
      
      const response = await api.post('/auth/login', loginData);
      login(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'An unexpected error occurred.');
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-900 overflow-hidden">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{ /* Particle options from previous step are unchanged */ }}
      />
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center w-full max-w-7xl bg-slate-800/50 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
          
          
          <div className="hidden lg:flex flex-col justify-between text-white p-12 h-full bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop')"}}>
             <div className="bg-black/50 p-6 rounded-lg">
                <motion.h1 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl font-bold mb-4 text-sky-400"
                >
                    Horizon+
                </motion.h1>
                <div className="h-28">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={quoteIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <p className="text-xl italic text-slate-200">"{inspirationalQuotes[quoteIndex].quote}"</p>
                            <p className="text-right mt-2 text-slate-400">- {inspirationalQuotes[quoteIndex].author}</p>
                        </motion.div>
                    </AnimatePresence>
                </div>
             </div>
             <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-sm text-slate-300/80"
             >
                Your journey to personal and professional growth starts here.
             </motion.p>
          </div>
          
          
          <div className="p-8 sm:p-12">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-md mx-auto"
            >
              <h2 className="text-3xl font-bold text-center text-white mb-2">
                {isConsultantLogin ? 'Consultant Login' : 'Welcome Back'}
              </h2>
              <p className="text-center text-slate-400 mb-8">
                {isConsultantLogin ? 'Access your professional dashboard.' : 'Sign in to continue your journey.'}
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && <p className="text-red-400 text-center bg-red-500/10 p-3 rounded-lg border border-red-500/30">{error}</p>}
                
                <div className="relative">
                  <label htmlFor="email" className="block text-slate-300 font-medium mb-2">Email Address</label>
                  <FiMail className="absolute left-4 top-12 transform -translate-y-1/2 text-slate-400" />
                  <input type="email" id="email" className="w-full pl-12 pr-4 py-3 bg-slate-700/50 text-white border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
                </div>
                
                <div className="relative">
                  <label htmlFor="password" className="block text-slate-300 font-medium mb-2">Password</label>
                  <FiLock className="absolute left-4 top-12 transform -translate-y-1/2 text-slate-400" />
                  <input type="password" id="password" className="w-full pl-12 pr-4 py-3 bg-slate-700/50 text-white border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
                </div>

                <button type="submit" className="w-full bg-sky-600 text-white font-bold py-3 rounded-lg hover:bg-sky-700 transition duration-300 flex items-center justify-center gap-2 text-lg">
                    <FiLogIn />
                    <span>Sign In</span>
                </button>
              </form>
              
              <p className="text-center text-slate-400 mt-6">
                Don't have an account? <Link to="/register" className="font-semibold text-sky-400 hover:underline">Sign up now</Link>
              </p>

              
              <div className="text-center mt-4 pt-4 border-t border-slate-700">
                  {isConsultantLogin ? (
                    <Link to="/login" className="text-sm text-slate-400 hover:text-white transition flex items-center justify-center gap-2">
                        <FiUser /> Not a consultant? User Login
                    </Link>
                  ) : (
                    <Link to="/login?role=consultant" className="text-sm text-slate-400 hover:text-white transition flex items-center justify-center gap-2">
                        <FiBriefcase /> Are you a consultant?
                    </Link>
                  )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;