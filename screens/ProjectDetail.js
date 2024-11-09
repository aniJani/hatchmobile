import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { editProjectById, getProjectById } from "../services/projectServices";

export default function ProjectDetailScreen({ route, navigation }) {
  const { projectId } = route.params;
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false); // To toggle between view and edit mode
  const [updatedProject, setUpdatedProject] = useState({}); // To store edited project data

  useEffect(() => {
    fetchProjectDetails();
  }, []);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const projectData = await getProjectById(projectId);
      setProject(projectData);
      setUpdatedProject(projectData); // Initialize updatedProject with fetched project data
    } catch (error) {
      console.error("Error fetching project details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    try {
      await editProjectById(projectId, updatedProject);
      Alert.alert("Success", "Project updated successfully");
      setEditMode(false); // Exit edit mode after saving
      fetchProjectDetails(); // Refresh project details after update
    } catch (error) {
      console.error("Error updating project:", error);
      Alert.alert("Error", "Failed to update project. Please try again.");
    }
  };

  const handleInputChange = (field, value) => {
    setUpdatedProject(prevState => ({
      ...prevState,
      [field]: value,
    }));
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
      {editMode ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Project Name"
            value={updatedProject.projectName}
            onChangeText={(text) => handleInputChange("projectName", text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            multiline
            value={updatedProject.description}
            onChangeText={(text) => handleInputChange("description", text)}
          />
        </>
      ) : (
        <>
          <Text style={styles.title}>{project.projectName}</Text>
          <Text style={styles.description}>{project.description}</Text>
        </>
      )}

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
      {Array.isArray(updatedProject.goals) && updatedProject.goals.length > 0 ? (
        updatedProject.goals.map((goal, index) => (
          <View key={index} style={styles.goalItem}>
            {editMode ? (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Goal Title"
                  value={goal.title}
                  onChangeText={(text) => {
                    const newGoals = [...updatedProject.goals];
                    newGoals[index].title = text;
                    setUpdatedProject({ ...updatedProject, goals: newGoals });
                  }}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Goal Description"
                  multiline
                  value={goal.description}
                  onChangeText={(text) => {
                    const newGoals = [...updatedProject.goals];
                    newGoals[index].description = text;
                    setUpdatedProject({ ...updatedProject, goals: newGoals });
                  }}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Assigned To"
                  value={goal.assignedTo}
                  onChangeText={(text) => {
                    const newGoals = [...updatedProject.goals];
                    newGoals[index].assignedTo = text;
                    setUpdatedProject({ ...updatedProject, goals: newGoals });
                  }}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Estimated Time"
                  value={goal.estimatedTime}
                  onChangeText={(text) => {
                    const newGoals = [...updatedProject.goals];
                    newGoals[index].estimatedTime = text;
                    setUpdatedProject({ ...updatedProject, goals: newGoals });
                  }}
                />
              </>
            ) : (
              <>
                <Text style={styles.goalTitle}>{goal.title}</Text>
                <Text style={styles.goalDescription}>{goal.description}</Text>
                <Text>Status: {goal.status}</Text>
                <Text>Assigned to: {goal.assignedTo}</Text>
                <Text>Estimated Time: {goal.estimatedTime}</Text>
              </>
            )}
          </View>
        ))
      ) : (
        <Text>No goals specified.</Text>
      )}

      <View style={styles.buttonContainer}>
        {editMode ? (
          <>
            <Button title="Save Changes" onPress={handleSaveChanges} />
            <Button title="Cancel" onPress={() => setEditMode(false)} color="red" />
          </>
        ) : (
          <Button title="Edit Project" onPress={() => setEditMode(true)} />
        )}
      </View>

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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  buttonContainer: {
    marginTop: 20,
  },
});
