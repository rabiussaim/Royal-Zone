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
      
      const setGuest = () => {
        const defaultUser = { _id: 'guest_' + Date.now(), name: 'Guest', email: '', role: 'user' };
        setUser(defaultUser);
        storage.set('rz_user', defaultUser);
        storage.remove('rz_token');
      };

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
          // Token expired or invalid — clear it and set as guest
          storage.remove('rz_token');
          storage.remove('rz_user');
          setGuest();
        }
      } else {
        // No token or demo token — set as guest
        setGuest();
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = useCallback(async (credentials) => {
    let loggedUser;
    let token = null;

    const data = await authService.login(credentials);
    loggedUser = data.user || data.data?.user || data;
    // Save real JWT token from server
    token = data.token || data.data?.token || null;

    if (credentials.email?.toLowerCase().trim() === OWNER_EMAIL) {
      loggedUser.role = 'admin';
    } else {
      loggedUser.role = loggedUser.role || 'user';
    }

    storage.set('rz_token', token);
    storage.set('rz_user', loggedUser);
    setUser(loggedUser);
    return { user: loggedUser };
  }, []);

  const register = useCallback(async (formData) => {
    let registeredUser;
    let token = null;
    const data = await authService.register(formData);
    registeredUser = data.user || data.data?.user || data;
    token = data.token || data.data?.token || null;

    if (formData.email?.toLowerCase().trim() === OWNER_EMAIL) {
      registeredUser.role = 'admin';
    } else {
      registeredUser.role = registeredUser.role || 'user';
    }

    storage.set('rz_token', token);
    storage.set('rz_user', registeredUser);
    setUser(registeredUser);
    return { user: registeredUser };
  }, []);

  // Used after Google OAuth — sets user directly without API call
  const loginWithToken = useCallback((token, userData) => {
    if (userData.email?.toLowerCase().trim() === OWNER_EMAIL) {
      userData.role = 'admin';
    }
    storage.set('rz_token', token);
    storage.set('rz_user', userData);
    setUser(userData);
    return { user: userData };
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

  // Check if real user (not guest)
  const isOwner = user?.email?.toLowerCase().trim() === OWNER_EMAIL;
  const isGuest = !user || (user._id && String(user._id).startsWith('guest_'));
  const isLoggedIn = !isGuest && !!storage.get('rz_token');

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      register,
      updateProfile,
      loginWithToken,
      isLoggedIn,
      isGuest,
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
