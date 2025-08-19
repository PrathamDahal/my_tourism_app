// components/AppText.js
import { Text } from 'react-native';
import { fontNames } from '../config/font';

const AppText = ({ 
  children, 
  style, 
  fontFamily = 'nunito', 
  weight = 'regular',
  ...props 
}) => {
  const getFontFamily = () => {
    if (typeof fontFamily === 'string') {
      // Handle direct font names (like 'Allura')
      if (fontFamily in fontNames && typeof fontNames[fontFamily] === 'string') {
        return fontNames[fontFamily];
      }
      // Handle font family with weights
      if (fontFamily in fontNames && fontNames[fontFamily][weight]) {
        return fontNames[fontFamily][weight];
      }
    }
    return fontNames.nunito.regular; // default font
  };

  return (
    <Text 
      style={[{ fontFamily: getFontFamily() }, style]}
      {...props}
    >
      {children}
    </Text>
  );
};

export default AppText;