import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Decode token or user data from local storage if persisted
      // For now, let's assume valid token means user is logged in
      // Ideally we should fetch me
      fetchMe(token);
    } else {
        setLoading(false);
    }
  }, [token]);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

  const fetchMe = async (currentToken) => {
      try {
          const res = await fetch(`${API_BASE}/auth/me`, {
              headers: {
                  'Authorization': `Bearer ${currentToken}`
              }
          });
          if (res.ok) {
              const userData = await res.json();
              setUser(userData);
          } else {
              logout();
          }
      } catch (error) {
          console.error("Error fetching user", error);
          logout();
      } finally {
          setLoading(false);
      }
  }

  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      setToken(data.token);
      localStorage.setItem('token', data.token);
      await fetchMe(data.token); // Fetch user details immediately
      return { success: true };
    } else {
      return { success: false, message: data.message };
    }
  };

  const register = async (userData) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        await fetchMe(data.token);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
  }

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
