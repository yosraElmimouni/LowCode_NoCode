import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, mockClients, mockProviders } from '@/lib/mockData';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  userType: 'client' | 'provider' | null;
  login: (email: string, password: string, userType: 'client' | 'provider') => boolean;
  logout: () => void;
  signup: (name: string, email: string, password: string, userType: 'client' | 'provider') => boolean;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<'client' | 'provider' | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedUserType = localStorage.getItem('userType');
    if (savedUser && savedUserType) {
      setUser(JSON.parse(savedUser));
      setUserType(savedUserType as 'client' | 'provider');
    }
  }, []);

  const login = (email: string, password: string, type: 'client' | 'provider'): boolean => {
    // Simulated login - in real app, would validate against backend
    let foundUser: User | null = null;

    if (type === 'client') {
      foundUser = mockClients.find(c => c.email === email) || null;
    } else {
      foundUser = mockProviders.find(p => p.email === email) || null;
    }

    if (foundUser) {
      setUser(foundUser);
      setUserType(type);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      localStorage.setItem('userType', type);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userType');
  };

  const signup = (name: string, email: string, password: string, type: 'client' | 'provider'): boolean => {
    // Simulated signup
    const newUser: User = {
      id: `${type === 'client' ? 'c' : 'p'}${Date.now()}`,
      name,
      email,
      phone: '',
      userType: type,
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      address: '',
    };

    if (type === 'provider') {
      const providerUser = newUser as any;
      providerUser.businessName = '';
      providerUser.specialties = [];
      providerUser.bio = '';
    }

    setUser(newUser);
    setUserType(type);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    localStorage.setItem('userType', type);
    return true;
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, userType, login, logout, signup, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
