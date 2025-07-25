import { View, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SelectionPage = () => {
  const navigation = useNavigation();

  const handleButtonPress = () => {
    navigation.navigate('MainStack');
  };

  return (
    <View style={styles.container}>
      <Button
        title="Go to Tourism App"
        onPress={handleButtonPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SelectionPage;