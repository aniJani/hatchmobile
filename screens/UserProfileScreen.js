import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { getUserByEmail } from "../services/userServices";
import { useAuth } from "../contexts/auth";

export default function UserProfileScreen() {
  const { authData, loading } = useAuth(); // Get authData and loading from context
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [skills, setSkills] = useState("");
  const [description, setDescription] = useState("");
  const [openToCollaboration, setOpenToCollaboration] = useState(false);
  const [userLoading, setUserLoading] = useState(true); // Loading state for user data

  // Function to load the user's profile using getUserByEmail
  const loadUserProfile = async () => {
    try {
      if (authData && authData.email) {
        const userData = await getUserByEmail(authData.email);
        setName(userData.name);
        setEmail(userData.email);
        setSkills(userData.skills.join(", ")); // Convert skills array to comma-separated string
        setDescription(userData.description);
        setOpenToCollaboration(userData.openToCollaboration);
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
      Alert.alert("Error", "Failed to load profile information.");
    } finally {
      setUserLoading(false); // Stop loading once data is fetched
    }
  };

  useEffect(() => {
    // Load user profile when the screen loads
    if (!loading) {
      loadUserProfile();
    }
  }, [loading, authData]);


  if (loading || userLoading) {
    // Show a loading spinner while fetching data
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

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
        editable={false} // Make email non-editable
      />
      <TextInput
        style={styles.input}
        placeholder="Skills (comma-separated)"
        value={skills}
        onChangeText={setSkills}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <View style={styles.checkboxContainer}>
        <Text>Open to Collaboration:</Text>
        <Button
          title={openToCollaboration ? "Yes" : "No"}
          onPress={() => setOpenToCollaboration(!openToCollaboration)}
        />
      </View>

      
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
});
