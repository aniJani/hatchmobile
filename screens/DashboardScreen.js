import React, { useEffect, useState } from "react";
import { ActivityIndicator, Button, FlatList, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../contexts/auth";
import { findUserMatch } from "../services/matchFinder";
import { loadProjects } from "../services/projectServices";
import { getUserByEmail } from "../services/userServices";

export default function DashboardScreen({ navigation }) {
  const { authData, loading } = useAuth(); // Access authData from the auth context
  const [projects, setProjects] = useState([]);
  const [userData, setUserData] = useState(null);
  const [suggestedCollaborators, setSuggestedCollaborators] = useState([]);

  useEffect(() => {
    if (!loading && authData) {
      fetchUserData();
      fetchProjects();
    }
  }, [loading, authData]);

  useEffect(() => {
    if (userData) {
      suggestCollaborators(); // Fetch collaborators automatically once user data is available
    }
  }, [userData]);

  const fetchUserData = async () => {
    try {
      const data = await getUserByEmail(authData.email);
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const projectData = await loadProjects(authData.email);
      setProjects(projectData);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  // Automatically suggest collaborators based on user description and skills
  const suggestCollaborators = async () => {
    try {
      const query = userData.description || userData.skills.join(", ");
      const collaborators = await findUserMatch(query, userData._id); // Pass logged-in user ID to exclude it
      setSuggestedCollaborators(collaborators.slice(0, 5)); // Show top 5 collaborators
    } catch (error) {
      console.error("Error finding user match:", error);
    }
  };

  // Navigate to search page for further collaborator exploration
  const handleSearchCollaborators = () => {
    navigation.navigate("SearchPage"); // Replace "SearchPage" with the actual name of your search page screen
  };

  const renderProject = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text>{item.description}</Text>
      <Button
        title="View Project"
        onPress={() => navigation.navigate("ProjectDetail", { projectId: item._id })}
      />
    </View>
  );

  const renderCollaborator = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text>Email: {item.email}</Text>
      <Text>Description: {item.description}</Text>
      <Text>Skills: {item.skills.join(", ")}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {!loading && authData && userData ? (
        <Text style={styles.email}>Welcome, {userData.name}!</Text>
      ) : (
        !loading && <Text style={styles.email}>Loading user data...</Text>
      )}

      <Text style={styles.sectionTitle}>Current Projects</Text>
      {projects.length === 0 ? (
        <Text>No projects available.</Text>
      ) : (
        <FlatList
          data={projects}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderProject}
        />
      )}

      <View style={styles.collaboratorsHeader}>
        <Text style={styles.sectionTitle}>Suggested Collaborators</Text>
        <Button title="Search" onPress={handleSearchCollaborators} />
      </View>

      {suggestedCollaborators.length === 0 ? (
        <Text>No collaborators suggested.</Text>
      ) : (
        <FlatList
          data={suggestedCollaborators}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderCollaborator}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  email: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  collaboratorsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 10,
  },
  card: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
