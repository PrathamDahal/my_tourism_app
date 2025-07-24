import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (userData, tokens) => {
    try {
      await AsyncStorage.setItem("accessToken", tokens.accessToken);
      await AsyncStorage.setItem("refreshToken", tokens.refreshToken);
      setUserToken(tokens.accessToken);
    } catch (error) {
      console.error("Error saving tokens:", error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("refreshToken");
      setUserToken(null);
    } catch (error) {
      console.error("Error clearing tokens:", error);
    }
  };

  const loadTokens = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("accessToken");
      if (storedToken) {
        setUserToken(storedToken);
      }
    } catch (error) {
      console.error("Error loading tokens:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTokens();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        userToken,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
