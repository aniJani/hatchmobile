import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Modal, FlatList } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Import MaterialIcons for the search icon
import { editProjectById, getProjectById, searchExternalCollaborators } from "../services/projectServices";

export default function ProjectDetailScreen({ route, navigation }) {
  const { projectId } = route.params;
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [goalEditModes, setGoalEditModes] = useState({}); // Track edit mode for each goal
  const [modalVisible, setModalVisible] = useState(false); // Track visibility of the modal
  const [selectedGoalIndex, setSelectedGoalIndex] = useState(null); // Track which goal is being edited
  const [updatedProject, setUpdatedProject] = useState({});
  const [searchQuery, setSearchQuery] = useState(""); // State for collaborator search
  const [filteredCollaborators, setFilteredCollaborators] = useState([]); // Filtered list of collaborators
  const [externalCollaborators, setExternalCollaborators] = useState([]); // List for external search results
  const [searchScope, setSearchScope] = useState("internal"); // "internal" or "external"

  useEffect(() => {
    fetchProjectDetails();
  }, []);

  useEffect(() => {
    if (project) {
      setFilteredCollaborators(project.collaborators);
    }
  }, [project]);

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

  const triggerProjectExplore = () => {
    // Add your explore functionality for the project here
    Alert.alert("Explore Project", "This feature will explore the project details further.");
  };
  
  
  const handleSaveGoalChanges = async (index) => {
    try {
      await editProjectById(projectId, updatedProject);
      Alert.alert("Success", "Goal updated successfully");
      setGoalEditModes((prev) => ({ ...prev, [index]: false })); // Turn off edit mode for this goal
      setModalVisible(false); // Close the modal
      fetchProjectDetails();
    } catch (error) {
      console.error("Error updating goal:", error);
      Alert.alert("Error", "Failed to update goal. Please try again.");
    }
  };

  const handleInputChange = (field, value, index) => {
    const newGoals = [...updatedProject.goals];
    newGoals[index][field] = value;
    setUpdatedProject({ ...updatedProject, goals: newGoals });
  };

  const openCollaboratorModal = (index) => {
    setSelectedGoalIndex(index);
    setModalVisible(true);
  };

  const selectCollaborator = (email) => {
    if (selectedGoalIndex !== null) {
      handleInputChange("assignedTo", email, selectedGoalIndex);
      setModalVisible(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredCollaborators(project.collaborators);
    } else {
      const filtered = project.collaborators.filter((collaborator) =>
        collaborator.email.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCollaborators(filtered);
    }
  };

  const triggerExternalSearch = async () => {
    try {
      const externalResults = await searchExternalCollaborators(searchQuery);
      setExternalCollaborators(externalResults);
      setSearchScope("external");
    } catch (error) {
      console.error("Error fetching external collaborators:", error);
      setExternalCollaborators([]);
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
          <TouchableOpacity onPress={triggerProjectExplore} style={styles.exploreIcon}>
            <MaterialIcons name="explore" size={30} color="#2196F3" />
          </TouchableOpacity>
        </View>
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
      {Array.isArray(updatedProject.goals) && updatedProject.goals.length > 0 ? (
        updatedProject.goals.map((goal, index) => (
          <View key={index} style={[styles.goalItem, goalEditModes[index] && styles.goalItemEdit]}>
            {goalEditModes[index] ? (
              <>
                <Text style={styles.goalSectionTitle}>Edit Goal:</Text>
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
                <TextInput
                  style={styles.input}
                  placeholder="Estimated Time"
                  value={goal.estimatedTime}
                  onChangeText={(text) => handleInputChange("estimatedTime", text, index)}
                />
                <TouchableOpacity onPress={() => openCollaboratorModal(index)} style={styles.pickerButton}>
                  <Text style={styles.pickerButtonText}>
                    {goal.assignedTo ? `Assigned To: ${goal.assignedTo}` : "Select Collaborator"}
                  </Text>
                </TouchableOpacity>
                <View style={styles.buttonGroup}>
                  <Button title="Save" onPress={() => handleSaveGoalChanges(index)} color="#4CAF50" />
                  <Button
                    title="Cancel"
                    onPress={() => setGoalEditModes((prev) => ({ ...prev, [index]: false }))}
                    color="#F44336"
                  />
                </View>
              </>
            ) : (
              <>
                <Text style={styles.goalTitle}>{goal.title}</Text>
                <Text style={styles.goalDescription}>{goal.description}</Text>
                <Text>Status: {goal.status}</Text>
                <Text>Assigned to: {goal.assignedTo}</Text>
                <Text>Estimated Time: {goal.estimatedTime}</Text>
                <Button
                  title="Edit Goal"
                  onPress={() => setGoalEditModes((prev) => ({ ...prev, [index]: true }))}
                  color="#2196F3"
                />
              </>
            )}
          </View>
        ))
      ) : (
        <Text>No goals specified.</Text>
      )}

      {/* Modal for selecting a collaborator */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Collaborator</Text>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search Internal Collaborators"
                value={searchQuery}
                onChangeText={handleSearch}
              />
              <TouchableOpacity onPress={triggerExternalSearch} style={styles.exploreIcon}>
                <MaterialIcons name="explore" size={30} color="#2196F3" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={filteredCollaborators}
              keyExtractor={(item) => item.email}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => selectCollaborator(item.email)}>
                  <Text style={styles.collaboratorItem}>{item.email}</Text>
                </TouchableOpacity>
              )}
            />
            
            <FlatList
              data={externalCollaborators}
              keyExtractor={(item) => item.email}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => selectCollaborator(item.email)}>
                  <Text style={styles.collaboratorItem}>{item.email}</Text>
                </TouchableOpacity>
              )}
            />
            <Button title="Close" onPress={() => setModalVisible(false)} color="#F44336" />
          </View>
        </View>
      </Modal>

      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Styles remain the same as before
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  projectTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Space out the project name and icon
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
  goalItemEdit: {
    borderColor: "#4CAF50", // Green border for edit mode
    backgroundColor: "#e8f5e9", // Light green background for edit mode
  },
  goalSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#4CAF50", // Green color for the "Edit Goal" title
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
    textAlignVertical: "top", // Ensures the text input for the description behaves like a text area
  },
  pickerButton: {
    padding: 10,
    backgroundColor: "#2196F3",
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 10,
  },
  pickerButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    flex: 1, // Use flex to make the search input take the remaining space
    borderRadius: 5,
  },
  exploreIcon: {
    marginLeft: 10, // Add some space between the search input and the icon
  },
  collaboratorItem: {
    padding: 10,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    width: "100%",
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});
