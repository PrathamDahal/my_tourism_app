import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUp from "../screens/register/SignUp";
import MyProfile from "../screens/protected/MyProfile";
import Dashboard from "../screens/protected/Dashboard/Dashboard";
import LoginScreen from "../screens/auth/LoginScreen";
import MyCart from "./../screens/protected/MyCart";
import ProtectedRoute from "./ProtectedRoute";

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen
        name="Dashboard"
        component={() => (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )}
      />
      <Stack.Screen
        name="MyProfile"
        component={() => (
          <ProtectedRoute>
            <MyProfile />
          </ProtectedRoute>
        )}
      />
      <Stack.Screen
        name="MyCart"
        component={() => (
          <ProtectedRoute>
            <MyCart />
          </ProtectedRoute>
        )}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
