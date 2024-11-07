import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import axios from "axios";

export default function UserProfileScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [skills, setSkills] = useState("");

  // Function to load the user's profile (simulated for now)
  const loadUserProfile = async () => {
    try {
      // Fetch user data from the backend
      const response = await axios.get("http://localhost:5000/user/profile");
      const userData = response.data;

      // Set the user's data in state variables
      setName(userData.name);
      setEmail(userData.email);
      setSkills(userData.skills.join(", ")); // Convert skills array to comma-separated string
    } catch (error) {
      console.error("Failed to load profile:", error);
      Alert.alert("Error", "Failed to load profile information.");
    }
  };

  useEffect(() => {
    // Load user profile when the screen loads
    loadUserProfile();
  }, []);

  const handleUpdateProfile = async () => {
    // Convert skills to an array by splitting the input on commas
    const skillsArray = skills.split(",").map((skill) => skill.trim());

    try {
      // Update user data on the backend
      const response = await axios.put("http://localhost:5000/user/profile", {
        name,
        email,
        skills: skillsArray,
      });

      if (response.status === 200) {
        Alert.alert("Success", "Profile updated successfully!");
      } else {
        Alert.alert("Error", "Failed to update profile.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong while updating the profile.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Skills (comma-separated)"
        value={skills}
        onChangeText={setSkills}
      />

      <Button title="Update Profile" onPress={handleUpdateProfile} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10,
  },
});
