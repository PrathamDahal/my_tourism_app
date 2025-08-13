import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null); // Add refreshToken state
  const [isLoading, setIsLoading] = useState(true);

  const login = async (tokens) => {
    if (!tokens?.accessToken || !tokens?.refreshToken) {
      console.warn("Tokens missing in login", tokens);
      return;
    }
    try {
      await AsyncStorage.setItem("accessToken", tokens.accessToken);
      await AsyncStorage.setItem("refreshToken", tokens.refreshToken);
      setUserToken(tokens.accessToken);
      setRefreshToken(tokens.refreshToken);  // save refresh token to state
    } catch (error) {
      console.error("Error saving tokens:", error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("refreshToken");
      setUserToken(null);
      setRefreshToken(null);  // clear refresh token state
    } catch (error) {
      console.error("Error clearing tokens:", error);
    }
  };

  const loadTokens = async () => {
    try {
      const storedAccessToken = await AsyncStorage.getItem("accessToken");
      const storedRefreshToken = await AsyncStorage.getItem("refreshToken");
      if (storedAccessToken) setUserToken(storedAccessToken);
      if (storedRefreshToken) setRefreshToken(storedRefreshToken);
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
        refreshToken, // expose refreshToken in context
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
