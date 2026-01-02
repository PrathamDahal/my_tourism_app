// screens/main/HomeStack.js
import { createStackNavigator } from "@react-navigation/stack";
import WhereToStay from "../screens/main/WhereToStay";
import StayDetails from "../components/WhereToStay/StayDetails";
import RoomBookings from "../components/WhereToStay/RoomBookings";

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
      <Stack.Screen name="RoomBookings" component={RoomBookings} />
    </Stack.Navigator>
  );
};

export default WhereToStayStack;
