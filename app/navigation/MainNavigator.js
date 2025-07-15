import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthStack from "./AuthStack";
import SideTab from "./Side Tab";
import SelectionPage from "../selection Page/SelectionPage";

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="SelectionPage" // Or whatever your initial route should be
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="SelectionPage" component={SelectionPage} />
      <Stack.Screen name="App" component={SideTab} />
      <Stack.Screen name="Auth" component={AuthStack} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
