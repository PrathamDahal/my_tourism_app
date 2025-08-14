// components/FontLoader.js
import { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import * as Font from 'expo-font';
import { fontAssets } from '../config/font';

const FontLoader = ({ children }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync(fontAssets);
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return children;
};

export default FontLoader;