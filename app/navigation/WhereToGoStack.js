// screens/main/HomeStack.js
import { createStackNavigator } from "@react-navigation/stack";
import DestinationDetails from "../components/WhereToGo/DestinationDetails";
import DestinationsPage from "../components/WhereToGo/DestinationsPage";
import WhereToGo from "../screens/main/WhereToGo";

const Stack = createStackNavigator();

const WhereToGoStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, 
      }}
    >
      <Stack.Screen name="whereToGo" component={WhereToGo} />
      <Stack.Screen name="DestinationDetails" component={DestinationDetails} />
      <Stack.Screen name="DestinationsPage" component={DestinationsPage} />
    </Stack.Navigator>
  );
};

export default WhereToGoStack;
