import React, { useState, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  SafeAreaView,
} from "react-native";
import AppText from "../components/AppText";

const SidebarTabView = ({ tabs, activeTabKey }) => {
  const [index, setIndex] = useState(
    tabs.findIndex((tab) => tab.key === activeTabKey) || 0
  );

  React.useEffect(() => {
    if (activeTabKey) {
      const i = tabs.findIndex((tab) => tab.key === activeTabKey);
      if (i !== -1 && i !== index) {
        setIndex(i);
      }
    }
  }, [activeTabKey]);

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [routes] = useState(
    tabs.map((tab) => ({ key: tab.key, title: tab.title }))
  );
  const sidebarAnimation = useRef(new Animated.Value(-300)).current; // Start off-screen

  const renderScene = ({ route }) => {
    const tab = tabs.find((t) => t.key === route.key);
    const Component = tab.component;
    return <Component />;
  };

  const toggleSidebar = () => {
    if (sidebarVisible) {
      Animated.timing(sidebarAnimation, {
        toValue: -300,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setSidebarVisible(false));
    } else {
      setSidebarVisible(true);
      Animated.timing(sidebarAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleTabPress = (i) => {
    setIndex(i);
    toggleSidebar(); // Close sidebar after selecting a tab
  };

  const renderTabBar = (props) => (
    <View style={styles.tabBarContainer}>
      {props.navigationState.routes.map((route, i) => (
        <TouchableOpacity
          key={route.key}
          style={[styles.tabItem, i === index && styles.activeTab]}
          onPress={() => handleTabPress(i)}
        >
          <Text style={[styles.tabText, i === index && styles.activeText]}>
            {route.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Menu Button */}
        <TouchableOpacity style={styles.menuButton} onPress={toggleSidebar}>
          <Text style={styles.menuButtonText}>☰</Text>
        </TouchableOpacity>

        {/* Current Tab Content */}
        <View style={{ flex: 1 }}>{renderScene({ route: routes[index] })}</View>
      </View>

      {/* Sidebar */}
      {sidebarVisible && (
        <Animated.View
          style={[
            styles.sidebar,
            { transform: [{ translateX: sidebarAnimation }] },
          ]}
        >
          <View style={styles.welcomeContainer}>
            <AppText style={styles.welcomeText} fontFamily="allura">
              Panchpokhari{" "}
              <AppText style={styles.welcomeHighlight}>Tourism</AppText>
            </AppText>
          </View>
          <View style={styles.sidebarHeader}>
            <Text style={styles.sidebarTitle}>Menu</Text>
            <TouchableOpacity onPress={toggleSidebar}>
              <Text style={styles.closeButton}>×</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.tabBarScroll}>
            {renderTabBar({ navigationState: { routes, index } })}
          </ScrollView>
        </Animated.View>
      )}

      {/* Overlay when sidebar is open */}
      {sidebarVisible && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={toggleSidebar}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    backgroundColor: "#fff",
  },
  menuButton: {
    position: "absolute",
    top: 140,
    right: 10,
    zIndex: 10,
    opacity: 0.7,
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: "#ccc",
    borderRadius: 9,
  },
  menuButtonText: {
    fontSize: 24,
    color: "#fff",
  },
  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: 250,
    backgroundColor: "#fff",
    alignContent: "center",
    zIndex: 20,
    borderRightWidth: 1,
    borderRightColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  welcomeContainer: {
    marginTop: 50,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  welcomeText: {
    color: "#FFA500",
    fontSize: 28,
  },
  welcomeHighlight: {
    color: "#FF0000",
    fontStyle: "italic",
  },
  sidebarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  sidebarTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    fontSize: 24,
    paddingHorizontal: 10,
  },
  tabBarContainer: {
    paddingVertical: 8,
  },
  tabBarScroll: {
    flex: 1,
  },
  tabItem: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  activeTab: {
    backgroundColor: "#f0f0f0",
  },
  tabText: {
    color: "#333",
    fontSize: 16,
  },
  activeText: {
    color: "#841584",
    fontWeight: "bold",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 15,
  },
});

export default SidebarTabView;
