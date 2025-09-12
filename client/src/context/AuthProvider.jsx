import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const userDataFromToken = JSON.parse(atob(token.split('.')[1]));
        setUser({ 
          token, 
          id: userDataFromToken.id, 
          role: userDataFromToken.role,
          username: localStorage.getItem('username') 
        });
      } catch (error) {
        console.error("Invalid token found, removing it.", error);
        localStorage.removeItem('token');
        localStorage.removeItem('username');
      }
    }
    setLoading(false);
  }, []);

  
  const login = (userDataFromServer) => {
    localStorage.setItem('token', userDataFromServer.token);
    localStorage.setItem('username', userDataFromServer.username);

    const standardizedUser = {
      token: userDataFromServer.token,
      id: userDataFromServer._id, 
      role: userDataFromServer.role,
      username: userDataFromServer.username,
    };
    setUser(standardizedUser);

    
    if (standardizedUser.role === 'consultant') {
      navigate('/consultant/dashboard');
    } else {
      navigate('/dashboard'); // This now goes to the protected welcome page
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUser(null);
    navigate('/'); // This goes to the public landing page
  };

  const value = { user, loading, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

