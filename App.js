import { useState, useCallback } from "react";
import { ScrollView, View, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { AuthProvider, useAuth } from "./app/context/AuthContext";
import MainNavigator from "./app/navigation/MainNavigator";
import { NavigationContainer } from "@react-navigation/native";
import FontLoader from "./app/components/FontLoader";
import { Provider } from "react-redux";
import store from "./app/store/store";
import { useRefreshTokenMutation } from "./app/services/auth/authApiSlice";

const RefreshableApp = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { refreshToken, logout } = useAuth();
  const [refreshTokenTrigger] = useRefreshTokenMutation();

  const onRefresh = useCallback(async () => {
    if (!refreshToken) {
      console.warn("No refresh token available");
      return logout();
    }
    setRefreshing(true);
    try {
      await refreshTokenTrigger({ refreshToken }).unwrap();
    } catch (error) {
      console.error("Token refresh failed:", error);
      logout();
    } finally {
      setRefreshing(false);
    }
  }, [refreshToken, refreshTokenTrigger, logout]);

  return (
    <>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <MainNavigator />
      </ScrollView>

      {/* Floating refresh button */}
      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity
          onPress={onRefresh}
          disabled={refreshing}
          style={[styles.button, refreshing && styles.buttonDisabled]}
          activeOpacity={0.7}
        >
          <Icon
            name="refresh"
            size={24}
            color={refreshing ? "#ccc" : "#fff"}
            style={refreshing && { transform: [{ rotate: "360deg" }] }}
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  floatingButtonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 1000,
  },
  button: {
    backgroundColor: "#007bff",
    opacity: 0.5,
    padding: 15,
    borderRadius: 30,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    backgroundColor: "#555",
  },
});

export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <NavigationContainer>
          <FontLoader>
            <RefreshableApp />
          </FontLoader>
        </NavigationContainer>
      </AuthProvider>
    </Provider>
  );
}
