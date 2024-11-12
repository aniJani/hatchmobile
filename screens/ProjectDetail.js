// ProjectDetailScreen.js

import { MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  Animated,
} from "react-native";
import ChatModal from "../components/chatModal"; // Import ChatModal
import CollaboratorSelectionModal from "../components/CollaboratorSelectionModal";
import ProjectSearchModal from "../components/ProjectSearchModal";
import { useAuth } from "../contexts/auth"; // Import useAuth if needed
import { editProjectById, getProjectById } from "../services/projectServices";
import { Divider } from "react-native-paper";
export default function ProjectDetailScreen({ route, navigation }) {
  const { projectId } = route.params;
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProjectSearchModalVisible, setIsProjectSearchModalVisible] =
    useState(false);
  const [updatedProject, setUpdatedProject] = useState({});
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedGoalIndex, setSelectedGoalIndex] = useState(null);
  const [editableGoalIndex, setEditableGoalIndex] = useState(null); // New state
  const [isChatModalVisible, setIsChatModalVisible] = useState(false); // New state

  const { authData } = useAuth(); // Access authData if needed

  useEffect(() => {
    fetchProjectDetails();
  }, []);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const projectData = await getProjectById(projectId);
      setProject(projectData);
      setUpdatedProject(projectData);
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
      setEditableGoalIndex(null);
      fetchProjectDetails();
    } catch (error) {
      console.error("Error updating project:", error);
      Alert.alert("Error", "Failed to update project. Please try again.");
    }
  };

  const handleInputChange = (field, value, index) => {
    const newGoals = [...updatedProject.goals];
    newGoals[index][field] = value;
    setUpdatedProject({ ...updatedProject, goals: newGoals });
  };

  const openAssignCollaboratorModal = (index) => {
    setSelectedGoalIndex(index);
    setAssignModalVisible(true);
  };

  const assignCollaboratorToGoal = (email) => {
    const updatedGoals = [...updatedProject.goals];
    updatedGoals[selectedGoalIndex].assignedTo = email;
    setUpdatedProject((prev) => ({ ...prev, goals: updatedGoals }));
    setAssignModalVisible(false);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!project) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load project details.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Go Back and Explore Buttons */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.goBackButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setIsProjectSearchModalVisible(true)}
        >
          <MaterialIcons name="explore" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Project Title */}
      <View style={styles.mainContainer}>
        <View style={styles.projectTitleContainer}>
          <Text style={styles.title}>{project.projectName}</Text>
        </View>
        <Divider></Divider>
        {/* Project Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{project.description}</Text>
        </View>
      </View>
      {/* Goals Section */}
      <View style={styles.Container}>
        <ScrollView
          style={styles.goalsContainer}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>Goals:</Text>
          {Array.isArray(updatedProject.goals) &&
          updatedProject.goals.length > 0 ? (
            updatedProject.goals.map((goal, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.goalCard,
                  {
                    borderColor:
                      goal.status === "not started"
                        ? "#ff4d4d"
                        : goal.status === "in progress"
                        ? "#ffa500"
                        : "#28a745",
                  },
                ]}
                onPress={() => setEditableGoalIndex(index)}
              >
                {editableGoalIndex === index ? (
                  <>
                    {/* Header with Cancel and Save Icons */}
                    <View style={styles.assignContainer}>
                      <TouchableOpacity
                        onPress={() => setEditableGoalIndex(null)}
                      >
                        <MaterialIcons name="cancel" size={24} color="#fff" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={handleSaveChanges}>
                        <MaterialIcons name="check" size={24} color="#fff" />
                      </TouchableOpacity>
                    </View>

                    {/* Goal Title Input */}

                    <TextInput
                      style={styles.input}
                      placeholder="Goal Title"
                      value={goal.title}
                      onChangeText={(text) =>
                        handleInputChange("title", text, index)
                      }
                      placeholderTextColor="#bbb"
                    />

                    {/* Goal Description Input */}
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      placeholder="Goal Description"
                      multiline
                      value={goal.description}
                      onChangeText={(text) =>
                        handleInputChange("description", text, index)
                      }
                      placeholderTextColor="#bbb"
                    />

                    {/* Status Buttons */}
                    <View style={styles.statusButtonsContainer}>
                      <TouchableOpacity
                        style={[
                          styles.statusButton,
                          {
                            borderColor:
                              goal.status === "not started"
                                ? "#ff4d4d"
                                : "#ccc",
                          },
                        ]}
                        onPress={() =>
                          handleInputChange("status", "not started", index)
                        }
                      >
                        <Text style={styles.statusButtonText}>Not Started</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.statusButton,
                          {
                            borderColor:
                              goal.status === "in progress"
                                ? "#ffa500"
                                : "#ccc",
                          },
                        ]}
                        onPress={() =>
                          handleInputChange("status", "in progress", index)
                        }
                      >
                        <Text style={styles.statusButtonText}>In Progress</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.statusButton,
                          {
                            borderColor:
                              goal.status === "completed" ? "#28a745" : "#ccc",
                          },
                        ]}
                        onPress={() =>
                          handleInputChange("status", "completed", index)
                        }
                      >
                        <Text style={styles.statusButtonText}>Completed</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Assigned To Section */}
                    <View style={styles.assignContainer}>
                      <Text style={styles.goalSectionLabel}>Assigned To:</Text>
                      <Text style={styles.goalDescription}>
                        {goal.assignedTo}
                      </Text>
                      <TouchableOpacity
                        style={styles.assignButton}
                        onPress={() => openAssignCollaboratorModal(index)}
                      >
                        <MaterialIcons
                          name="person-add"
                          size={24}
                          color="#fff"
                        />
                      </TouchableOpacity>
                    </View>

                    {/* Estimated Time Input */}
                    <Text style={styles.goalSectionLabel}>Estimated Time:</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Estimated Time"
                      value={goal.estimatedTime}
                      onChangeText={(text) =>
                        handleInputChange("estimatedTime", text, index)
                      }
                      placeholderTextColor="#bbb"
                    />
                  </>
                ) : (
                  <>
                    <Text style={styles.goalTitle}>{goal.title}</Text>
                    <Text style={styles.goalDescription}>
                      {goal.description}
                    </Text>
                    <Text style={styles.goalDescription}>
                      Assigned to: {goal.assignedTo}
                    </Text>
                    <Text style={styles.goalDescription}>
                      Estimated Time: {goal.estimatedTime}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noGoalsText}>No goals specified.</Text>
          )}
        </ScrollView>
      </View>

      {/* Project Search Modal */}
      <ProjectSearchModal
        visible={isProjectSearchModalVisible}
        onClose={() => setIsProjectSearchModalVisible(false)}
        projectId={projectId}
        projectGoals={project.goals}
        projectCollaborators={project.collaborators}
        navigation={navigation}
      />

      {/* Collaborator Selection Modal */}
      <CollaboratorSelectionModal
        visible={assignModalVisible}
        onClose={() => setAssignModalVisible(false)}
        projectCollaborators={project.collaborators}
        goalDescription={
          updatedProject.goals[selectedGoalIndex]?.description || ""
        }
        navigation={navigation}
        onSelectCollaborator={assignCollaboratorToGoal}
      />

      {/* Chat Button */}
      <TouchableOpacity
        style={styles.chatButton}
        onPress={() => setIsChatModalVisible(true)}
      >
        <MaterialIcons name="chat" size={24} color="#fff" />
        <Text style={styles.chatButtonText}>Chat</Text>
      </TouchableOpacity>

      {/* Chat Modal */}
      <ChatModal
        visible={isChatModalVisible}
        onClose={() => setIsChatModalVisible(false)}
        projectId={projectId}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#272222",
    height: "100%",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
    marginBottom: 15,
  },
  mainContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#3b3636",
    borderRadius: 20,
    marginBottom: 10,
    alignItems: "center",
  },

  Container: {
    flex: 1,
    padding: 5,
    backgroundColor: "#3b3636",
    borderRadius: 18,
  },
  goalsContainer: {
    flex: 1,
    padding: 5,
    backgroundColor: "#3b3636",
  },

  projectTitleContainer: {
    paddingTop: 15,
  },

  statusButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  statusContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  statusButton: {
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  activeStatus: {
    backgroundColor: "#3A78F2",
  },
  inactiveStatus: {
    backgroundColor: "#2B2B3A",
  },
  statusText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  statusButton: {
    flex: 1,
    padding: 5,
    marginHorizontal: 5,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
  },
  statusButtonText: {
    color: "#fff",
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 10,
    color: "#FFFFFF",
  },
  description: {
    fontSize: 16,
    color: "#f5f5f5",
    marginBottom: 20,
    padding: 8,
  },
  sectionTitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
    color: "#FFFFFF",
  },
  goalCard: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1, // Add border width
    backgroundColor: "#494444",
  },
  goalTitle: {
    fontSize: 16,
    color: "#FFFFFF",
    marginVertical: 5,
  },
  goalDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.5)",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    color: "#fff",
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
    marginTop: 10,
    color: "rgba(255, 255, 255, 0.5)",
  },
  assignButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 5,
    backgroundColor: "#28a745", // Added background color for visibility
  },
  noGoalsText: {
    fontSize: 14,
    color: "#777",
  },
  saveButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    backgroundColor: "#444", // Added background color
  },
  goBackButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    backgroundColor: "#444", // Added background color
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  assignContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignContent: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
  chatButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#2c45c9",
    borderRadius: 30,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  chatButtonText: {
    color: "#fff",
    marginLeft: 10,
    fontSize: 16,
  },
});
