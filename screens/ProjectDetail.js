import { MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import ProjectSearchModal from "../components/ProjectSearchModal";
import { editProjectById, getProjectById } from "../services/projectServices";

export default function ProjectDetailScreen({ route, navigation }) {
  const { projectId } = route.params;
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProjectSearchModalVisible, setIsProjectSearchModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [updatedProject, setUpdatedProject] = useState({});

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
      setEditMode(false);
      fetchProjectDetails(); // Refresh the project details
    } catch (error) {
      console.error("Error updating project:", error);
      Alert.alert("Error", "Failed to update project. Please try again.");
    }
  };

  const handleInputChange = (field, value, index = null) => {
    if (index !== null) {
      const newGoals = [...updatedProject.goals];
      newGoals[index][field] = value;
      setUpdatedProject({ ...updatedProject, goals: newGoals });
    } else {
      setUpdatedProject((prevState) => ({
        ...prevState,
        [field]: value,
      }));
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
        {editMode ? (
          <TextInput
            style={styles.input}
            placeholder="Project Name"
            value={updatedProject.projectName}
            onChangeText={(text) => handleInputChange("projectName", text)}
          />
        ) : (
          <Text style={styles.title}>{project.projectName}</Text>
        )}
      </View>

      {editMode ? (
        <TextInput
          style={styles.input}
          placeholder="Description"
          multiline
          value={updatedProject.description}
          onChangeText={(text) => handleInputChange("description", text)}
        />
      ) : (
        <Text style={styles.description}>{project.description}</Text>
      )}

      <Button title="Find Suggested Collaborators" onPress={() => setIsProjectSearchModalVisible(true)} />

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
                  onChangeText={(text) => handleInputChange("title", text, index)}
                />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Goal Description"
                  multiline
                  value={goal.description}
                  onChangeText={(text) => handleInputChange("description", text, index)}
                />

                <Text style={styles.goalSectionLabel}>Status:</Text>
                <Picker
                  selectedValue={goal.status}
                  style={styles.picker}
                  onValueChange={(itemValue) => handleInputChange("status", itemValue, index)}
                >
                  <Picker.Item label="Not Started" value="not started" />
                  <Picker.Item label="In Progress" value="in progress" />
                  <Picker.Item label="Completed" value="completed" />
                </Picker>

                <Text style={styles.goalSectionLabel}>Assigned To:</Text>
                <Picker
                  selectedValue={goal.assignedTo}
                  style={styles.picker}
                  onValueChange={(itemValue) => handleInputChange("assignedTo", itemValue, index)}
                >
                  <Picker.Item label="Select Collaborator" value="" />
                  {project.collaborators.map((collaborator, idx) => (
                    <Picker.Item key={idx} label={collaborator.email} value={collaborator.email} />
                  ))}
                </Picker>

                <Text style={styles.goalSectionLabel}>Estimated Time:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Estimated Time"
                  value={goal.estimatedTime}
                  onChangeText={(text) => handleInputChange("estimatedTime", text, index)}
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

      <ProjectSearchModal
        visible={isProjectSearchModalVisible}
        onClose={() => setIsProjectSearchModalVisible(false)}
        projectGoals={project.goals} // Pass the goals array to the modal
      />

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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  picker: {
    height: 50,
    width: "100%",
    marginVertical: 5,
  },
  goalSectionLabel: {
    fontWeight: "bold",
    marginTop: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});
