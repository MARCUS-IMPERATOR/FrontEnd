import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    isLoading: true,
    user: null
  });


  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        setAuthState({
          isLoggedIn: true,
          isLoading: false,
          user: JSON.parse(userData)
        });
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };
    loadUser();
  }, []);

  const login = async (userData) => {
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
    setAuthState({
      isLoggedIn: true,
      isLoading: false,
      user: userData
    });
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userData');
    setAuthState({
      isLoggedIn: false,
      isLoading: false,
      user: null
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);