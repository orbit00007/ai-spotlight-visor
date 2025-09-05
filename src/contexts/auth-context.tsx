import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '@/services/api';

interface User {
  id: string;
  email: string;
  name: string;
  first_name?: string;
  last_name?: string;
}

interface Application {
  id: string;
  company_name: string;
  project_token: string;
}

interface AuthContextType {
  user: User | null;
  application: Application | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string, companyName?: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [application, setApplication] = useState<Application | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('user');
    const storedApplication = localStorage.getItem('application');
    const storedToken = localStorage.getItem('accessToken');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedApplication) {
      setApplication(JSON.parse(storedApplication));
    }
    if (storedToken) {
      setAccessToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(email, password);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      if (response.data) {
        const { user: userData, access_token } = response.data;
        const formattedUser = {
          id: userData.id,
          email: userData.email,
          name: userData.first_name && userData.last_name 
            ? `${userData.first_name} ${userData.last_name}` 
            : userData.email.split('@')[0],
          first_name: userData.first_name,
          last_name: userData.last_name
        };
        
        setUser(formattedUser);
        setAccessToken(access_token);
        localStorage.setItem('user', JSON.stringify(formattedUser));
        localStorage.setItem('accessToken', access_token);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string, companyName?: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.register(email, password, firstName, lastName, companyName);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      if (response.data) {
        const { user: userData, access_token, application: appData } = response.data;
        const formattedUser = {
          id: userData.id,
          email: userData.email,
          name: `${userData.first_name} ${userData.last_name}`,
          first_name: userData.first_name,
          last_name: userData.last_name
        };
        
        setUser(formattedUser);
        setAccessToken(access_token);
        localStorage.setItem('user', JSON.stringify(formattedUser));
        localStorage.setItem('accessToken', access_token);
        
        if (appData) {
          setApplication(appData);
          localStorage.setItem('application', JSON.stringify(appData));
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setApplication(null);
    setAccessToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('application');
    localStorage.removeItem('accessToken');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      application, 
      accessToken, 
      login, 
      register, 
      logout, 
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}