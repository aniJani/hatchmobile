import React, { useState } from "react";
import { Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../contexts/auth";
import { createTaskDivision, saveProjectToDatabase } from "../services/goalDivision";

export default function InitProject({ navigation }) {
  const { authData } = useAuth();
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedTaskIndex, setExpandedTaskIndex] = useState(null);
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);
  const [editedTask, setEditedTask] = useState({ stepTitle: "", description: "", estimatedTime: "" });

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
      <Button title="Done" onPress={handleSaveTasks} style={styles.doneButton} />
      <Text style={styles.title}>Project Task Generator</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter project name..."
        value={projectName}
        onChangeText={(text) => setProjectName(text)}
      />
      <TextInput
        style={styles.input}
        multiline
        placeholder="Describe your project..."
        value={projectDescription}
        onChangeText={(text) => setProjectDescription(text)}
      />
      <Button title="Generate Tasks" onPress={handleGenerateTasks} disabled={loading} />

      {loading ? (
        <Text style={styles.loadingText}>Generating tasks...</Text>
      ) : (
        <ScrollView style={styles.taskList}>
          {tasks.map((task, index) => (
            <View key={index} style={styles.taskCard}>
              <TouchableOpacity onPress={() => toggleDropdown(index)}>
                <Text style={styles.taskTitle}>{`${task.stepNumber || index + 1}: ${task.stepTitle}`}</Text>
              </TouchableOpacity>
              {expandedTaskIndex === index && (
                <View style={styles.taskDetails}>
                  {editingTaskIndex === index ? (
                    <>
                      <TextInput
                        style={styles.editInput}
                        placeholder="Task Title"
                        value={editedTask.stepTitle}
                        onChangeText={(text) => setEditedTask({ ...editedTask, stepTitle: text })}
                      />
                      <TextInput
                        style={styles.editInput}
                        placeholder="Task Description"
                        multiline
                        value={editedTask.description}
                        onChangeText={(text) => setEditedTask({ ...editedTask, description: text })}
                      />
                      <TextInput
                        style={styles.editInput}
                        placeholder="Estimated Time"
                        value={editedTask.estimatedTime}
                        onChangeText={(text) => setEditedTask({ ...editedTask, estimatedTime: text })}
                      />
                      <Button title="Save" onPress={saveEditedTask} />
                    </>
                  ) : (
                    <>
                      <Text style={styles.taskDescription}>{task.description}</Text>
                      <Text style={styles.taskTime}>{`Estimated Time: ${task.estimatedTime}`}</Text>
                      <Button title="Edit" onPress={() => startEditing(index)} />
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
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: "top",
  },
  loadingText: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 16,
  },
  taskList: {
    marginTop: 20,
  },
  taskCard: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  taskDetails: {
    marginTop: 10,
  },
  taskDescription: {
    fontSize: 16,
    marginTop: 5,
  },
  taskTime: {
    fontSize: 14,
    marginTop: 5,
    color: "#666",
  },
  editInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  doneButton: {
    marginTop: 20,
  },
});
