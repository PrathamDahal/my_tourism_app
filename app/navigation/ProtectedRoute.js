import React, { useContext } from 'react';
import { View, Text, Button } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Please login to access this page</Text>
        <Button 
          title="Go to Login" 
          onPress={() => navigation.navigate('Account', { screen: 'Login' })}
        />
      </View>
    );
  }

  return children;
};

export default ProtectedRoute;