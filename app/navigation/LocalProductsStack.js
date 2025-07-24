import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LocalProducts from "../screens/main/LocalProducts/index";
import ProductDisplay from "../components/LocalProduct Components/Products/ProductDisplay";
import ProductDetails from "../components/LocalProduct Components/Products/ProductDetails";
import CategoryProducts from "../components/LocalProduct Components/Categories/CategoryProducts";

const Stack = createNativeStackNavigator();

const LocalProductsStack = () => {

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LocalProducts" component={LocalProducts} />
      <Stack.Screen name="ProductDisplay" component={ProductDisplay} />
      <Stack.Screen name="ProductDetails" component={ProductDetails} />
      <Stack.Screen name="CategoryProducts" component={CategoryProducts} />
    </Stack.Navigator>
  );
};

export default LocalProductsStack;
