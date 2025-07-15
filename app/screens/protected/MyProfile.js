import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import ProtectedRoute from "../../navigation/ProtectedRoute";

const MyProfile = ({ navigation }) => {
  return (
    <ProtectedRoute>
      <View style={styles.container}>
        <Text style={styles.title}>My Profile</Text>
        <Text>User information goes here</Text>
      </View>
    </ProtectedRoute>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default MyProfile;
