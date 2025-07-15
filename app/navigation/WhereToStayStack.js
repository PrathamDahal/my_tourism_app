// screens/main/HomeStack.js
import { createStackNavigator } from "@react-navigation/stack";
import WhereToStay from "../screens/main/WhereToStay";
import StayDetails from "../components/WhereToStay/StayDetails";

const Stack = createStackNavigator();

const WhereToStayStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, 
      }}
    >
      <Stack.Screen name="WhereToStay" component={WhereToStay} />
      <Stack.Screen name="StayDetails" component={StayDetails} />
    </Stack.Navigator>
  );
};

export default WhereToStayStack;
