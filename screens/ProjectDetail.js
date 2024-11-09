import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Button, FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import ProjectSearchModal from "../components/ProjectSearchModal"; // Import the new modal
import { editProjectById, getProjectById } from "../services/projectServices";

export default function ProjectDetailScreen({ route, navigation }) {
  const { projectId } = route.params;
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProjectSearchModalVisible, setIsProjectSearchModalVisible] = useState(false);

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
      <View style={styles.projectTitleContainer}>
        <Text style={styles.title}>{project.projectName}</Text>
      </View>
      <Text style={styles.description}>{project.description}</Text>

      {/* Button to open the Project Search Modal */}
      <Button title="Find Suggested Collaborators" onPress={() => setIsProjectSearchModalVisible(true)} />

      <Text style={styles.sectionTitle}>Goals:</Text>
      {Array.isArray(project.goals) && project.goals.length > 0 ? (
        project.goals.map((goal, index) => (
          <View key={index} style={styles.goalItem}>
            <Text style={styles.goalTitle}>{goal.title}</Text>
            <Text style={styles.goalDescription}>{goal.description}</Text>
          </View>
        ))
      ) : (
        <Text>No goals specified.</Text>
      )}

      {/* Project Search Modal */}
      <ProjectSearchModal
        visible={isProjectSearchModalVisible}
        onClose={() => setIsProjectSearchModalVisible(false)}
        projectGoals={project.goals} // Pass the goals array to the modal
      />

      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Styles for the main component
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  projectTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  goalItem: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  goalTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  goalDescription: {
    fontSize: 14,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});
