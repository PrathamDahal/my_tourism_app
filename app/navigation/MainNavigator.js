// MainNavigator.js
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SelectionPage from "../selection Page/SelectionPage";
import AuthStack from "./AuthStack";
import MainMenuStack from "./MainMenuStack";

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SelectionPage" component={SelectionPage} />
      <Stack.Screen name="MainStack" component={MainMenuStack} />
      <Stack.Screen name="Auth" component={AuthStack} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
