import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import type { User, AuthResponse } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (data: AuthResponse) => Promise<void>;
  register: (data: { nickname: string; password: string; displayName: string }) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function decodeToken(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedToken = localStorage.getItem('accessToken');
    const savedUser = localStorage.getItem('user');
    if (savedToken) {
      const payload = decodeToken(savedToken);
      if (payload) {
        setToken(savedToken);
        // Fallback to saved user if payload missing details, or use payload
        setUser(payload.nickname ? {
          id: payload.sub,
          nickname: payload.nickname,
          displayName: payload.displayName
        } : (savedUser ? JSON.parse(savedUser) : null));
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (authData: AuthResponse) => {
    setToken(authData.accessToken);
    localStorage.setItem('accessToken', authData.accessToken);
    
    const payload = decodeToken(authData.accessToken);
    if (payload) {
      const userObj = {
        id: payload.sub,
        nickname: payload.nickname || '',
        displayName: payload.displayName || ''
      };
      setUser(userObj);
      localStorage.setItem('user', JSON.stringify(userObj));
    }
    
    navigate('/feed');
  };

  const register = async (regData: any) => {
    await client.post('/auth/register', regData);
    navigate('/login');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
