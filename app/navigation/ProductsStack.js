import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LocalProducts from "./../screens/main/LocalProducts/index";

const Stack = createNativeStackNavigator();

const LocalProductsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="LocalProducts" component={LocalProducts} />
  </Stack.Navigator>
);

export default LocalProductsStack;
