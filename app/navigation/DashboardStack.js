// screens/main/HomeStack.js
import { createStackNavigator } from "@react-navigation/stack";
import Dashboard from "../screens/protected/Dashboard/Dashboard";

const Stack = createStackNavigator();

const DashboardStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Hide headers for all screens in this stack
      }}
    >
      <Stack.Screen name="Dashboard" component={Dashboard} />
      {/* <Stack.Screen name="Site-Setting" component={} /> */}
      {/* <Stack.Screen name="Category" component={} />
      <Stack.Screen name="Product" component={} />
      <Stack.Screen name="Accomodation" component={} />
      <Stack.Screen name="Travel" component={} /> */}
    </Stack.Navigator>
  );
};

export default DashboardStack;
