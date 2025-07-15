import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { stayOptions } from "../../data/StayOptions";

const StayOptions = () => {
  return (
    <View style={styles.container}>
      <View style={styles.optionsContainer}>
        {stayOptions.map((option, index) => (
          <View key={index} style={styles.optionItem}>
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: option.color }]}
              activeOpacity={0.7}
            >
              <Text style={styles.iconText}>{option.icon()}</Text>
            </TouchableOpacity>
            <Text style={styles.optionTitle}>{option.title}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#e5e7eb",
    marginTop: -15,
    borderRadius: 8,
    marginBottom: 24,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  optionItem: {
    width: "25%",             // 4 items per row
    padding: 8,
    alignItems: "center",
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    color: "#fff",
    fontSize: 24,
  },
  optionTitle: {
    marginTop: 4,
    fontSize: 12,
    textAlign: "center",
  },
});

export default StayOptions;
