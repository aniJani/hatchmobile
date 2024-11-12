import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Import MaterialIcons
import { useAuth } from "../contexts/auth";
import {
  createTaskDivision,
  saveProjectToDatabase,
} from "../services/goalDivision";

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
      await saveProjectToDatabase(
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
      <Text style={styles.title}>Project Task Generator</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter project name..."
        placeholderTextColor="gray"
        value={projectName}
        onChangeText={(text) => setProjectName(text)}
      />
      <TextInput
        style={styles.input}
        multiline
        placeholder="Describe your project..."
        placeholderTextColor="gray"
        value={projectDescription}
        onChangeText={(text) => setProjectDescription(text)}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleGenerateTasks}
          style={[styles.generateButton, styles.button]}
          disabled={loading}
        >
          <MaterialIcons name="autorenew" size={24} color="#fff" />
          <Text style={styles.buttonText}>Generate Tasks</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSaveTasks}
          style={[styles.doneButton, styles.button]}
        >
          <MaterialIcons name="done" size={24} color="#fff" />
          <Text style={styles.buttonText}>Done</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text style={styles.loadingText}>Generating tasks...</Text>
      ) : (
        <View style={styles.taskContainer}>
          <ScrollView style={styles.taskList}>
            {tasks.map((task, index) => (
              <View key={index} style={styles.taskCard}>
                <TouchableOpacity onPress={() => toggleDropdown(index)}>
                  <Text style={styles.taskTitle}>{`${
                    task.stepNumber || index + 1
                  }: ${task.stepTitle}`}</Text>
                </TouchableOpacity>
                {expandedTaskIndex === index && (
                  <View style={styles.taskDetails}>
                    {editingTaskIndex === index ? (
                      <>
                        <TextInput
                          style={styles.editInput}
                          placeholder="Task Title"
                          value={editedTask.stepTitle}
                          onChangeText={(text) =>
                            setEditedTask({ ...editedTask, stepTitle: text })
                          }
                        />
                        <TextInput
                          style={styles.editInput}
                          placeholder="Task Description"
                          multiline
                          value={editedTask.description}
                          onChangeText={(text) =>
                            setEditedTask({ ...editedTask, description: text })
                          }
                        />
                        <TextInput
                          style={styles.editInput}
                          placeholder="Estimated Time"
                          value={editedTask.estimatedTime}
                          onChangeText={(text) =>
                            setEditedTask({
                              ...editedTask,
                              estimatedTime: text,
                            })
                          }
                        />
                        <TouchableOpacity
                          onPress={saveEditedTask}
                          style={[styles.saveButton, styles.button]}
                        >
                          <MaterialIcons name="save" size={24} color="#fff" />
                          <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <>
                        <Text style={styles.taskDescription}>
                          {task.description}
                        </Text>
                        <Text
                          style={styles.taskTime}
                        >{`Estimated Time: ${task.estimatedTime}`}</Text>
                        <TouchableOpacity
                          onPress={() => startEditing(index)}
                          style={[styles.editButton]}
                        >
                          <MaterialIcons name="edit" size={24} color="#fff" />
                          <Text style={styles.buttonText}>Edit</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#000814",
    paddingBottom: 85,
    paddingTop: 60,
  },
  title: {
    fontSize: 20,

    textAlign: "center",
    marginBottom: 20,
    color: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: "top",
    color: "#fff",
    backgroundColor: "#1c2431",
  },
  loadingText: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 16,
    color: "#fff",
  },
  taskContainer: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#0e1623",
  },
  taskList: {
    marginTop: 10,
  },
  taskCard: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#1c2431",
    borderRadius: 8,
  },
  taskTitle: {
    fontSize: 18,
    color: "#fff",
  },
  taskDetails: {
    marginTop: 10,
  },
  taskDescription: {
    fontSize: 16,
    marginTop: 5,
    color: "#fff",
  },
  taskTime: {
    fontSize: 14,
    marginTop: 5,
    color: "#ccc",
  },
  editInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
    color: "#fff",
    backgroundColor: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
    width: "48%",
    // Set a fixed width for buttons
    backgroundColor: "#003380",
  },
  buttonText: {
    color: "#fff",
  },
  editButton: {
    paddingHorizontal: 20,
    paddingTop: 5,
    borderRadius: 10,
    alignSelf: "center",
    backgroundColor: "#003380",
    marginTop: 5,
  },
});
