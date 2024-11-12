import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Switch,
} from "react-native";
import { useAuth } from "../contexts/auth";
import { getUserByEmail, updateUser } from "../services/userServices";
import { Divider } from "react-native-paper";
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
      <Text style={styles.username}>{authData.name}</Text>
      <View style={styles.section}>
        <TextInput
          style={styles.input}
          placeholder="Skills (comma-separated)"
          value={skills}
          onChangeText={setSkills}
          editable={isOwnProfile}
        />
        {isOwnProfile && (
          <TouchableOpacity
            style={styles.updateButton}
            onPress={() =>
              handleUpdateField(
                "skills",
                skills.split(", ").map((s) => s.trim())
              )
            }
          >
            <Text style={styles.updateButtonText}>Update Skills</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.section}>
        <TextInput
          style={styles.inputDescription}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          editable={isOwnProfile}
        />
        {isOwnProfile && (
          <TouchableOpacity
            style={styles.updateButton}
            onPress={() => handleUpdateField("description", description)}
          >
            <Text style={styles.updateButtonText}>Update Description</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.sectionCollab}>
        <Text style={styles.sectionTitleCollab}>Open to Collaboration:</Text>

        <View style={styles.switchContainer}>
          {isOwnProfile && (
            <Switch
              value={openToCollaboration}
              onValueChange={(value) => {
                setOpenToCollaboration(value);
                handleUpdateField("openToCollaboration", value);
              }}
            />
          )}
        </View>
      </View>
      <Divider></Divider>
      <View style={styles.section}>
        {isOwnProfile && (
          <TouchableOpacity
            style={[styles.logoutButton]}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    backgroundColor: "#272222",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "left",
    marginBottom: 20,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 40,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
    marginTop: 15,
  },
  avatarText: {
    fontSize: 20,
    color: "#fff",
  },
  username: {
    fontSize: 28,
    fontStyle: "Questrial",
    color: "#fff",
    marginBottom: 10,
  },
  section: {
    width: "100%",
    padding: 10,
    borderRadius: 25,
  },
  sectionCollab: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#333",
    borderRadius: 30,
  },
  sectionTitle: {
    fontSize: 16,
    alignSelf: "center",
    color: "#fff",
    marginBottom: 5,
  },
  sectionTitleCollab: {
    fontSize: 14,
    padding: 10,
    color: "#fff",
  },
  inputDescription: {
    width: "100%",
    backgroundColor: "#333",
    color: "#fff",
    padding: 10,
    borderRadius: 15,
    marginBottom: 15,
    fontSize: 12,
    alignContent: "left",
  },
  input: {
    backgroundColor: "#333",
    color: "#fff",
    padding: 10,
    borderRadius: 15,
    marginBottom: 15,
    fontSize: 12,
  },
  updateButton: {
    backgroundColor: "#2c45c9",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 2,
    marginBottom: 5,
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoutButton: {
    paddingVertical: 5,
    borderRadius: 8,
    alignItems: "left",
    marginBottom: 5,
  },
  logoutButtonText: {
    color: "red",
    fontSize: 14,
  },
  deleteButton: {
    paddingVertical: 5,
    borderRadius: 8,
    alignItems: "left",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 14,
  },
});
