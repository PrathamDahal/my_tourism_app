import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LocalProducts from "../screens/main/LocalProducts/index";
import ProductDisplay from "../components/LocalProduct Components/Products/ProductDisplay";
import ProductDetails from "../components/LocalProduct Components/Products/ProductDetails";
import MyCart from "../screens/protected/MyCart";

const Stack = createNativeStackNavigator();

const LocalProductsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="LocalProducts" component={LocalProducts} />
    <Stack.Screen name="ProductDisplay" component={ProductDisplay} />
    <Stack.Screen name="ProductDetails" component={ProductDetails} />
    <Stack.Screen name="MyCart" component={MyCart} />
  </Stack.Navigator>
);

export default LocalProductsStack;
