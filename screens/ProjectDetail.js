import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Button, ScrollView } from "react-native";
import { getProjectById } from "../services/projectServices";

export default function ProjectDetailScreen({ route, navigation }) {
  const { projectId } = route.params;
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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{project.projectName}</Text>
      <Text style={styles.description}>{project.description}</Text>

      <Text style={styles.sectionTitle}>Collaborators:</Text>
      {Array.isArray(project.collaborators) && project.collaborators.length > 0 ? (
        project.collaborators.map((collaborator, index) => (
          <Text key={index}>
            {collaborator.email} - {collaborator.role}
          </Text>
        ))
      ) : (
        <Text>No collaborators listed.</Text>
      )}

      <Text style={styles.sectionTitle}>Goals:</Text>
      {Array.isArray(project.goals) && project.goals.length > 0 ? (
        project.goals.map((goal, index) => (
          <View key={index} style={styles.goalItem}>
            <Text style={styles.goalTitle}>{goal.title}</Text>
            <Text style={styles.goalDescription}>{goal.description}</Text>
            <Text>Status: {goal.status}</Text>
            <Text>Assigned to: {goal.assignedTo}</Text>
            <Text>Estimated Time: {goal.estimatedTime}</Text>
          </View>
        ))
      ) : (
        <Text>No goals specified.</Text>
      )}

      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </ScrollView>
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
  goalItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  goalTitle: {
    fontWeight: "bold",
  },
  goalDescription: {
    marginBottom: 5,
  },
});
