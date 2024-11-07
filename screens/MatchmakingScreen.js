import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function MatchmakingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Matchmaking</Text>
      <Text>This screen will show potential collaborators.</Text>
      <Button
        title="Go Back to Register"
        onPress={() => navigation.navigate("Register")}
      />
      <Button
        title="Go to your Goals"
        onPress={() => navigation.navigate("Goals")}
      />
      <Button
        title="Go to Dashboard"
        onPress={() => navigation.navigate("Dashboard")}
      />
    </View>
  );
  Goalss;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
