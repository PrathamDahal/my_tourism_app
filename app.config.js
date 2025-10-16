// app.config.js
export default {
  expo: {
    name: "Tourism-App",
    slug: "my_tourism_app",
    version: "1.0.0",
    orientation: "default",
    icon: "./assets/T-App-icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: false,
    updates: {
      enabled: false,
    },
    splash: {
      image: "./assets/T-App-Splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/T-App-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      package: "com.DeeyoSoftSolutions.my_tourism_app",
    },
    web: {
      favicon: "./assets/T-App-icon.png",
    },
    plugins: ["expo-font"],
  },
};