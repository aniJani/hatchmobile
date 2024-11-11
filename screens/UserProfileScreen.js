import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useAuth } from "../contexts/auth";
import { getUserByEmail, updateUser } from "../services/userServices";

export default function UserProfileScreen() {
  const { authData, loading, signOut } = useAuth();
  const [skills, setSkills] = useState("");
  const [description, setDescription] = useState("");
  const [openToCollaboration, setOpenToCollaboration] = useState(false);
  const [userLoading, setUserLoading] = useState(true);

  const loadUserProfile = async () => {
    try {
      if (authData && authData.email) {
        const userData = await getUserByEmail(authData.email);
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
      const updatedUser = await updateUser(authData.email, { [field]: value });
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
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="Skills (comma-separated)"
        value={skills}
        onChangeText={setSkills}
      />
      <Button title="Update Skills" onPress={() => handleUpdateField("skills", skills.split(", ").map(s => s.trim()))} />

      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Button title="Update Description" onPress={() => handleUpdateField("description", description)} />

      <View style={styles.checkboxContainer}>
        <Text>Open to Collaboration:</Text>
        <Button
          title={openToCollaboration ? "Yes" : "No"}
          onPress={() => {
            setOpenToCollaboration(!openToCollaboration);
            handleUpdateField("openToCollaboration", !openToCollaboration);
          }}
        />
      </View>

      <Button title="Log Out" onPress={handleLogout} />
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
