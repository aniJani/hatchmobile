import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, ActivityIndicator } from "react-native";
import { getProjectById } from "../services/projectServices"; // Import the function to fetch project details

export default function ProjectDetailScreen({ route, navigation }) {
  const { projectId } = route.params; // Get the projectId from the route parameters
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjectDetails();
  }, []);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const projectData = await getProjectById(projectId);
      setProject(projectData);
    } catch (error) {
      console.error("Error fetching project details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!project) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load project details.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{project.projectName}</Text>
      <Text style={styles.description}>{project.description}</Text>
      
      <Text style={styles.sectionTitle}>Collaborators:</Text>
      {project.collaborators.length > 0 ? (
        project.collaborators.map((collaborator, index) => (
          <Text key={index}>
            {collaborator.email} - {collaborator.role}
          </Text>
        ))
      ) : (
        <Text>No collaborators listed.</Text>
      )}

      <Text style={styles.sectionTitle}>Goals:</Text>
      {project.goals.length > 0 ? (
        project.goals.map((goal, index) => (
          <Text key={index}>{goal}</Text>
        ))
      ) : (
        <Text>No goals specified.</Text>
      )}

      <Button title="Go Back" onPress={() => navigation.goBack()} />
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
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});
