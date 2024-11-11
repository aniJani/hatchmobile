import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, View, TouchableOpacity } from "react-native";
import { useAuth } from "../contexts/auth";
import { getUserByEmail, updateUser } from "../services/userServices";

export default function UserProfileScreen({ route }) {
  const { authData, loading, signOut } = useAuth();
  const [skills, setSkills] = useState("");
  const [description, setDescription] = useState("");
  const [openToCollaboration, setOpenToCollaboration] = useState(false);
  const [userLoading, setUserLoading] = useState(true);

  // Check if the profile being viewed belongs to the logged-in user
  const emailFromRoute = route?.params?.email;
  const isOwnProfile = !emailFromRoute || emailFromRoute === authData.email;

  const loadUserProfile = async () => {
    try {
      const email = emailFromRoute || authData.email;
      if (email) {
        const userData = await getUserByEmail(email);
        setSkills(userData.skills.join(", "));
        setDescription(userData.description);
        setOpenToCollaboration(userData.openToCollaboration);
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
      Alert.alert("Error", "Failed to load profile information.");
    } finally {
      setUserLoading(false);
    }
  };

  const handleUpdateField = async (field, value) => {
    try {
      await updateUser(authData.email, { [field]: value });
      Alert.alert("Success", `${field} updated successfully`);
    } catch (error) {
      console.error(`Failed to update ${field}:`, error);
      Alert.alert("Error", `Failed to update ${field}`);
    }
  };

  const handleLogout = () => {
    signOut();
  };

  useEffect(() => {
    if (!loading) {
      loadUserProfile();
    }
  }, [loading, authData]);

  if (loading || userLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.username}>User Profile</Text>
      <Text style={styles.username}>{authData.name}</Text>
      <TextInput
        style={styles.input}
        placeholder="Skills (comma-separated)"
        value={skills}
        onChangeText={setSkills}
        editable={isOwnProfile}
      />
      {isOwnProfile && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleUpdateField("skills", skills.split(", ").map(s => s.trim()))}
        >
          <Text style={styles.buttonText}>Update Skills</Text>
        </TouchableOpacity>
      )}

      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        editable={isOwnProfile}
      />
      {isOwnProfile && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleUpdateField("description", description)}
        >
          <Text style={styles.buttonText}>Update Description</Text>
        </TouchableOpacity>
      )}

      <View style={styles.checkboxContainer}>
        <Text style={styles.checkboxText}>Open to Collaboration:</Text>
        {isOwnProfile ? (
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setOpenToCollaboration(!openToCollaboration);
              handleUpdateField("openToCollaboration", !openToCollaboration);
            }}
          >
            <Text style={styles.buttonText}>{openToCollaboration ? "Yes" : "No"}</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.checkboxText}>{openToCollaboration ? "Yes" : "No"}</Text>
        )}
      </View>

      {isOwnProfile && (
        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#272222", // Dark background color
  },
  username: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 10, color: "#FFFFFF" }, // Increased font size
  
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
    color: "#fff", // White text color
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10,
    color: "#fff", // White text color
    backgroundColor: "#3a3a3a", // Slightly darker background for input fields
    borderRadius: 5, // Rounded borders for inputs
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    justifyContent: "space-between", // Space between the text and button
  },
  checkboxText: {
    color: "#fff", // White text color
    fontSize: 16,
  },
  button: {
    backgroundColor: "#444", // Dark background for buttons
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 5,
  },
  buttonText: {
    color: "#fff", // White text color for buttons
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#dc3545", // Red color for logout button
  },
});
