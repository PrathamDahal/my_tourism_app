// screens/main/HomeStack.js
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/main/Home";
import PopularDestinations from "../components/Home Components/Popular Destination/PopularDestinations";
import FeaturedActivitiesSlider from "../components/Home Components/Featured Activities/FeaturedActivitiesSlider";
import FeaturedAccomodations from './../components/Home Components/Featured Accomodations/FeaturedAccomodations';
import TravelPackages from "../components/Home Components/Travel Packages/TravelPackages";
import DestinationDetails from "../components/WhereToGo/DestinationDetails";
import StayDetails from "../components/WhereToStay/StayDetails";

const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Hide headers for all screens in this stack
      }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="FeaturedActivities" component={FeaturedActivitiesSlider} />
      <Stack.Screen name="FeaturedAccommodations" component={FeaturedAccomodations} />
      <Stack.Screen name="StayDetails" component={StayDetails} />
      <Stack.Screen name="PopularDestinations" component={PopularDestinations} />
      <Stack.Screen name="DestinationDetails" component={DestinationDetails} />
      <Stack.Screen name="TravelPackages" component={TravelPackages} />
    </Stack.Navigator>
  );
};

export default HomeStack;
