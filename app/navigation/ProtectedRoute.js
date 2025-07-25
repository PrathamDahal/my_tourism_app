import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { userToken } = useAuth();
  const navigation = useNavigation();

  if (!userToken) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Please login to access this page</Text>
        <Button 
          title="Go to Login" 
          onPress={() => navigation.navigate('MainMenu', { screen: 'Login' })}
        />
      </View>
    );
  }

  return children;
};

export default ProtectedRoute;
