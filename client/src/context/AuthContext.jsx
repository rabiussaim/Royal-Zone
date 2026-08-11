import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { storage } from '../utils/helpers';

const AuthContext = createContext();

export const OWNER_EMAIL = 'saimlinkedin0000@gmail.com';


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: check token or saved user
  useEffect(() => {
    const initAuth = async () => {
      const token = storage.get('rz_token');
      const savedUser = storage.get('rz_user');
      if (token && !token.startsWith('demo_token_')) {
        // Real token — verify with server
        try {
          const data = await authService.getMe();
          const currentUser = data.data || data.user || data;
          if (currentUser.email?.toLowerCase() === OWNER_EMAIL) {
            currentUser.role = 'admin';
          }
          setUser(currentUser);
        } catch {
          // Token expired or invalid — use saved user if available
          if (savedUser) {
            setUser(savedUser);
          } else {
            storage.remove('rz_token');
            storage.remove('rz_user');
          }
        }
      } else if (savedUser) {
        // Demo token or no token — use saved user
        setUser(savedUser);
      } else {
        // Brand new visitor — set as guest so cart works without login
        const defaultUser = { _id: 'guest_' + Date.now(), name: 'Guest', email: '', role: 'user' };
        setUser(defaultUser);
        storage.set('rz_user', defaultUser);
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = useCallback(async (credentials) => {
    let loggedUser;
    let token = null;
    try {
      const data = await authService.login(credentials);
      loggedUser = data.user || data.data?.user || data;
      // Save real JWT token from server
      token = data.token || data.data?.token || null;
    } catch {
      // Fallback for frontend demo login (no server)
      loggedUser = {
        _id: 'u_' + Date.now(),
        name: credentials.email?.toLowerCase().includes('royal') ? 'Royal Zone Owner' : credentials.email.split('@')[0],
        email: credentials.email,
        role: credentials.email?.toLowerCase().trim() === OWNER_EMAIL ? 'admin' : 'user',
      };
    }

    if (credentials.email?.toLowerCase().trim() === OWNER_EMAIL) {
      loggedUser.role = 'admin';
    } else {
      loggedUser.role = 'user';
    }

    // Use real token if available, otherwise demo token
    storage.set('rz_token', token || 'demo_token_' + Date.now());
    storage.set('rz_user', loggedUser);
    setUser(loggedUser);
    return { user: loggedUser };
  }, []);

  const register = useCallback(async (formData) => {
    let registeredUser;
    let token = null;
    try {
      const data = await authService.register(formData);
      registeredUser = data.user || data.data?.user || data;
      token = data.token || data.data?.token || null;
    } catch {
      registeredUser = {
        _id: 'u_' + Date.now(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.email?.toLowerCase().trim() === OWNER_EMAIL ? 'admin' : 'user',
      };
    }

    if (formData.email?.toLowerCase().trim() === OWNER_EMAIL) {
      registeredUser.role = 'admin';
    } else {
      registeredUser.role = 'user';
    }

    storage.set('rz_token', token || 'demo_token_' + Date.now());
    storage.set('rz_user', registeredUser);
    setUser(registeredUser);
    return { user: registeredUser };
  }, []);

  const logout = useCallback(() => {
    storage.remove('rz_token');
    storage.remove('rz_user');
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    const data = await authService.updateProfile(profileData);
    const updatedUser = { ...(user || {}), ...(data.user || data) };
    setUser(updatedUser);
    storage.set('rz_user', updatedUser);
    return data;
  }, [user]);

  // STRICT PERMISSION CHECK:
  // ONLY user with email saimlinkedin0000@gmail.com is owner
  const isOwner = user?.email?.toLowerCase().trim() === OWNER_EMAIL;

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      register,
      updateProfile,
      isLoggedIn: !!user,
      isOwner,
      ownerEmail: OWNER_EMAIL,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
