import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  createTaskDivision,
  saveTasksToDatabase,
} from "../services/goalDivision";
import { useAuth } from "../contexts/auth";

export default function InitProject({ navigation }) {
  const { authData } = useAuth();
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedTaskIndex, setExpandedTaskIndex] = useState(null);
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);
  const [editedTask, setEditedTask] = useState({
    stepTitle: "",
    description: "",
    estimatedTime: "",
  });
  const handleBack = () => {
    navigation.goBack();
  };

  const handleGenerateTasks = async () => {
    if (!projectDescription.trim()) {
      alert("Please enter a project description.");
      return;
    }

    setLoading(true);
    try {
      const generatedTasks = await createTaskDivision(projectDescription);
      setTasks(generatedTasks.subtasks || []);
    } catch (error) {
      console.error("Error generating tasks:", error);
      alert("Failed to generate tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = (index) => {
    setExpandedTaskIndex(expandedTaskIndex === index ? null : index);
  };

  const startEditing = (index) => {
    setEditingTaskIndex(index);
    setEditedTask(tasks[index]);
  };

  const saveEditedTask = () => {
    const updatedTasks = [...tasks];
    updatedTasks[editingTaskIndex] = editedTask;
    setTasks(updatedTasks);
    setEditingTaskIndex(null);
  };

  const handleSaveTasks = async () => {
    if (!projectName.trim()) {
      alert("Please enter a project name.");
      return;
    }

    try {
      await saveTasksToDatabase(
        projectName,
        projectDescription,
        authData?.email,
        tasks
      );
      alert("Project and tasks saved successfully!");
      navigation.navigate("Dashboard");
    } catch (error) {
      console.error("Error saving project and tasks:", error);
      alert("Failed to save project. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.doneContainer}>
          <TouchableOpacity onPress={handleBack} style={styles.iconButton}>
            <Ionicons
              name="chevron-back-circle-outline"
              size={30}
              color="#fff"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSaveTasks} style={styles.iconButton}>
            <Text style={styles.doneIconText}>✓</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.title}>Add Project</Text>
      <TextInput
        style={styles.inputName}
        multiline
        placeholder="Project Name"
        placeholderTextColor="#b0b0b0"
        value={projectName}
        onChangeText={(text) => setProjectName(text)}
      />
      <TextInput
        style={styles.input}
        multiline
        placeholder="Project Description"
        placeholderTextColor="#b0b0b0"
        value={projectDescription}
        onChangeText={(text) => setProjectDescription(text)}
      />
      <TouchableOpacity
        onPress={handleGenerateTasks}
        style={styles.generateButton}
        disabled={loading}
      >
        <Text style={styles.generateButtonText}>Generate</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#5e548e"
          style={styles.loading}
        />
      ) : (
        <ScrollView style={styles.taskList}>
          {tasks.map((task, index) => (
            <View key={index} style={styles.taskCard}>
              <TouchableOpacity onPress={() => toggleDropdown(index)}>
                <Text style={styles.taskTitle}>{`${task.stepTitle}`}</Text>
              </TouchableOpacity>
              {expandedTaskIndex === index && (
                <View style={styles.taskDetails}>
                  {editingTaskIndex === index ? (
                    <>
                      <TextInput
                        style={styles.editInput}
                        value={editedTask.stepTitle}
                        onChangeText={(text) =>
                          setEditedTask({ ...editedTask, stepTitle: text })
                        }
                      />
                      <TextInput
                        style={styles.editInput}
                        multiline
                        value={editedTask.description}
                        onChangeText={(text) =>
                          setEditedTask({ ...editedTask, description: text })
                        }
                      />
                      <TextInput
                        style={styles.editInput}
                        value={editedTask.estimatedTime}
                        onChangeText={(text) =>
                          setEditedTask({ ...editedTask, estimatedTime: text })
                        }
                      />
                      <TouchableOpacity
                        style={styles.saveButton}
                        onPress={saveEditedTask}
                      >
                        <Text style={styles.saveButtonText}>Save</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <Text style={styles.taskDescription}>
                        {task.description}
                      </Text>
                      <Text style={styles.taskTime}>
                        Estimated Time: {task.estimatedTime}
                      </Text>
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => startEditing(index)}
                      >
                        <Text style={styles.editButtonText}>Edit</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1a1a2e",
  },
  header: {
    flexDirection: "column",
    justifyContent: "space-between",

    marginBottom: 20,
  },
  title: {
    marginTop: 5,
    fontSize: 20,
    fontStyle: "Poppins",
    color: "#fff",
  },
  doneContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  doneIcon: {
    padding: 10,
  },
  doneIconText: {
    fontSize: 30,
    color: "#fff",
  },
  inputName: {
    height: 60,
    backgroundColor: "#2e2e3e",
    color: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    marginTop: 15,
    textAlignVertical: "top",
    fontSize: 16,
  },
  input: {
    height: 100,
    backgroundColor: "#2e2e3e",
    color: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    marginTop: 15,
    textAlignVertical: "top",
    fontSize: 16,
  },
  generateButton: {
    backgroundColor: "#495057",
    paddingVertical: 15,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 20,
    width: "85%",
    alignSelf: "center",
  },
  generateButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  loading: {
    marginVertical: 20,
  },
  taskList: {
    marginTop: 10,
  },
  taskCard: {
    backgroundColor: "#2e2e3e",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  taskTitle: {
    fontSize: 15,
    alignSelf: "center",
    color: "#fff",
  },
  taskDetails: {
    marginTop: 10,
  },
  taskDescription: {
    fontSize: 16,
    color: "#b0b0b0",
    marginTop: 5,
  },
  taskTime: {
    fontSize: 14,
    color: "#b0b0b0",
    marginTop: 5,
  },
  editInput: {
    backgroundColor: "#3e3e4e",
    color: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#5e548e",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  editButton: {
    backgroundColor: "#5e548e",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
