import { AuthProvider } from "./app/context/AuthContext";
import MainNavigator from "./app/navigation/MainNavigator";
import { NavigationContainer } from "@react-navigation/native";
import FontLoader from "./app/components/FontLoader";
import { Provider } from "react-redux";
import store from "./app/store/store";

export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <NavigationContainer>
          <FontLoader>
            <MainNavigator />
          </FontLoader>
        </NavigationContainer>
      </AuthProvider>
    </Provider>
  );
}
