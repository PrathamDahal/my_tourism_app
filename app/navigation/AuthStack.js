import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import SignUp from "../screens/register/SignUp";
import MyProfile from "../screens/protected/MyProfile";
import Dashboard from "../screens/protected/Dashboard/Dashboard";
import LoginScreen from "../screens/auth/LoginScreen";
import MyCart from './../screens/protected/MyCart';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  const { userToken } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userToken ? (
        <>
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="MyProfile" component={MyProfile} />
          <Stack.Screen name="MyCart" component={MyCart} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUp} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AuthStack;
