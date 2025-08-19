// screens/main/HomeStack.js
import { createStackNavigator } from "@react-navigation/stack";
import TravelPackagesScreen from "../screens/main/Travel";
import TravelPackageDetails from "../components/Travel Package/PackageDetails";


const Stack = createStackNavigator();

const TravelPackageStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, 
      }}
    >
      <Stack.Screen name="travelPackage" component={TravelPackagesScreen} />
      <Stack.Screen name="TravelPackageDetails" component={TravelPackageDetails} />
      {/* <Stack.Screen name="DestinationsPage" component={} /> */}
    </Stack.Navigator>
  );
};

export default TravelPackageStack;
