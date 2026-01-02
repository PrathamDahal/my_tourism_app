import { useState, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // Add this import
import { AuthProvider, useAuth } from "./app/context/AuthContext";
import MainNavigator from "./app/navigation/MainNavigator";
import { NavigationContainer } from "@react-navigation/native";
import FontLoader from "./app/components/FontLoader";
import { Provider } from "react-redux";
import store from "./app/store/store";

const RefreshableApp = () => {
  return (
    <View style={styles.container}>
      <MainNavigator />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gestureHandler: {
    flex: 1,
  },
});

export default function App() {
  return (
    <GestureHandlerRootView style={styles.gestureHandler}>
      <Provider store={store}>
        <AuthProvider>
          <NavigationContainer>
            <FontLoader>
              <RefreshableApp />
            </FontLoader>
          </NavigationContainer>
        </AuthProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}