import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../api.js';
import { FiUser, FiBriefcase, FiMail, FiLock, FiUserPlus, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';


const checkPasswordStrength = (password) => {
    let score = 0;
    if (!password) return 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
};

const RegisterPage = () => {
  const [formData, setFormData] = useState({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
  });
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validation, setValidation] = useState({});
  const { login } = useAuth();

  
  const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
  };

  useEffect(() => {
    const { email, password, confirmPassword } = formData;
    const newValidation = {};
    if (email) {
        newValidation.email = /\S+@\S+\.\S+/.test(email);
    }
    if (password && confirmPassword) {
        newValidation.passwordMatch = password === confirmPassword;
    }
    setValidation(newValidation);
  }, [formData]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.');
        return;
    }
    setIsLoading(true);

    try {
      const { username, email, password } = formData;
      const response = await api.post('/auth/register', { username, email, password, role });
      login(response.data);
    } catch (err) {
      console.error("Registration failed:", err);
      if (err.response) {
        setError(err.response.data.message || 'The server responded with an error.');
      } else if (err.request) {
        setError('Could not connect to the server. Please check your network.');
      } else {
        setError('An unexpected error occurred while setting up the request.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = checkPasswordStrength(formData.password);
  const strengthLabels = ['Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500'];

  return (
    <div 
        className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans"
        style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4d4d8' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}}
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-2xl rounded-2xl p-8 sm:p-12 w-full max-w-3xl border border-slate-200"
      >
        <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-slate-800">Join Horizon+</h1>
            <p className="text-slate-500 mt-2">Start your journey toward growth and connection today.</p>
        </div>

        <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-700 mb-4">Choose Your Path:</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['user', 'consultant'].map((r) => (
                    <motion.div
                        key={r}
                        onClick={() => setRole(r)}
                        className={`p-6 border-2 rounded-lg cursor-pointer transition-all duration-300 relative ${role === r ? (r === 'user' ? 'border-sky-500 bg-sky-50 shadow-lg' : 'border-teal-500 bg-teal-50 shadow-lg') : 'border-slate-200 hover:border-slate-400'}`}
                        whileTap={{ scale: 0.98 }}
                    >
                        {role === r && (
                            <motion.div initial={{opacity: 0, scale: 0.5}} animate={{opacity: 1, scale: 1}} className="absolute top-2 right-2 bg-white rounded-full p-1">
                                <FiCheckCircle className={r === 'user' ? 'text-sky-500' : 'text-teal-500'} />
                            </motion.div>
                        )}
                        {r === 'user' ? <FiUser className={`mx-auto text-4xl mb-3 ${role === r ? 'text-sky-600' : 'text-slate-400'}`} /> : <FiBriefcase className={`mx-auto text-4xl mb-3 ${role === r ? 'text-teal-600' : 'text-slate-400'}`} />}
                        <h3 className="text-center font-bold text-slate-800">{r === 'user' ? 'I am a User' : 'I am a Consultant'}</h3>
                        <p className="text-center text-sm text-slate-500 mt-1">{r === 'user' ? 'Seeking guidance and personal development.' : 'Offering expertise and professional services.'}</p>
                    </motion.div>
                ))}
            </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <p className="text-red-600 text-center bg-red-100 p-3 rounded-lg flex items-center gap-2 justify-center"><FiAlertCircle/> {error}</p>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Username</label>
              <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" required />
              </div>
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Email Address</label>
              <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" required />
                  {validation.email && <FiCheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Password</label>
              <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" required />
              </div>
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Confirm Password</label>
              <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" required />
                  {validation.passwordMatch && <FiCheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />}
              </div>
            </div>
          </div>
          
          {formData.password.length > 0 && (
              <div className="flex items-center gap-3">
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden"><div className={`h-2 rounded-full ${strengthColors[passwordStrength]} transition-all duration-300`} style={{ width: `${passwordStrength * 25}%` }}></div></div>
                  <span className="text-sm text-slate-500 w-28 text-right font-medium">{strengthLabels[passwordStrength]}</span>
              </div>
          )}

          <button type="submit" disabled={isLoading} className="w-full bg-sky-600 text-white font-bold py-3 rounded-lg hover:bg-sky-700 transition-all duration-300 flex items-center justify-center gap-2 text-lg shadow-lg hover:shadow-xl disabled:bg-slate-400 disabled:cursor-not-allowed">
              {isLoading ? (<>
                <motion.div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                <span>Creating Account...</span>
              </>) : (<>
                <FiUserPlus />
                <span>Create Account</span>
              </>)}
          </button>
        </form>

        <p className="text-center text-slate-500 mt-8">
          Already have an account? <Link to="/login" className="font-semibold text-sky-600 hover:underline">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;

