import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./../screens/auth/Login";
import { AuthContext } from "../context/AuthContext";
import SignUp from "./../screens/register/SignUp";
import MyProfile from './../screens/protected/MyProfile';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  const { user } = useContext(AuthContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="MyProfile" component={MyProfile} />
      ) : (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="SignUp" component={SignUp} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AuthStack;
