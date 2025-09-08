// MainNavigator.js
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeStack from "./HomeStack";
import ContactUs from "../screens/main/ContactUs";
import LocalProductsStack from "./LocalProductsStack";
import WhereToGoStack from "./WhereToGoStack";
import WhereToStayStack from "./WhereToStayStack";
import MainNavigationMenuScreen from '../screens/main/Menu/MainMenuScreen';
import TravelPackageStack from './TravelPackageStack';
import UserTracking from "../screens/main/Tracking/UserTracking";

const Stack = createNativeStackNavigator();

const MainMenuStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainMenu" component={MainNavigationMenuScreen} />
      <Stack.Screen name="HomeStack" component={HomeStack} />
      <Stack.Screen name="WhereToGoStack" component={WhereToGoStack} />
      <Stack.Screen name="WhereToStayStack" component={WhereToStayStack} />
      <Stack.Screen name="LocalProductsStack" component={LocalProductsStack} />
      <Stack.Screen name="TravelPackageStack" component={TravelPackageStack} />
      <Stack.Screen name="ContactUs" component={ContactUs} />
      <Stack.Screen name="UserTracking" component={UserTracking} />
    </Stack.Navigator>
  );
};

export default MainMenuStack;
