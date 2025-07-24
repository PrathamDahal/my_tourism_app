import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { stayOptions } from "../../data/StayOptions";

const StayOptions = ({ onSelectType }) => {
  const [selectedType, setSelectedType] = useState("All");

  const handleSelect = (type) => {
    setSelectedType(type);
    if (onSelectType) {
      onSelectType(type); // pass selected type back to parent
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.optionsContainer}>
        {stayOptions.map((option, index) => (
          <View key={index} style={styles.optionItem}>
            <TouchableOpacity
              onPress={() => handleSelect(option.title)}
              style={[
                styles.iconButton,
                {
                  backgroundColor:
                    selectedType === option.title ? "#111827" : option.color,
                },
              ]}
              activeOpacity={0.7}
            >
              <Text style={styles.iconText}>{option.icon()}</Text>
            </TouchableOpacity>
            <Text
              style={[
                styles.optionTitle,
                selectedType === option.title && { fontWeight: "bold" },
              ]}
            >
              {option.title}
            </Text>
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
    width: "25%",
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
