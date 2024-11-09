import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Button, ActivityIndicator } from "react-native";
import { loadProjects } from "../services/projectServices";
import { useAuth } from "../contexts/auth";
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
      suggestCollaborators();
    }
  }, [loading, authData]);

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

  // Function to suggest collaborators (placeholder logic)
  const suggestCollaborators = () => {
    // Placeholder logic for suggesting collaborators
    // You may replace this with real logic based on your use case
    const collaborators = [
      { id: 1, name: "Alice Johnson", email: "alice@example.com" },
      { id: 2, name: "Bob Smith", email: "bob@example.com" },
      { id: 3, name: "Charlie Davis", email: "charlie@example.com" },
    ];
    setSuggestedCollaborators(collaborators);
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

      <Text style={styles.sectionTitle}>Suggested Collaborators</Text>
      {suggestedCollaborators.length === 0 ? (
        <Text>No collaborators suggested.</Text>
      ) : (
        <FlatList
          data={suggestedCollaborators}
          keyExtractor={(item) => item.id.toString()}
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
