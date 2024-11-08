import React, { useState } from "react";
import { View, Text, TextInput, Button, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { createTaskDivision } from "../services/goalDivision"; // Correctly import the API function

export default function InitProject() {
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
      setTasks(generatedTasks.subtasks || []); // Use an empty array if 'subtasks' is undefined
    } catch (error) {
      console.error("Error generating tasks:", error);
      alert("Failed to generate tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = (index) => {
    if (expandedTaskIndex === index) {
      setExpandedTaskIndex(null); // Collapse if the same task is clicked
    } else {
      setExpandedTaskIndex(index); // Expand the clicked task
    }
  };

  const startEditing = (index) => {
    setEditingTaskIndex(index);
    setEditedTask(tasks[index]);
  };

  const saveEditedTask = () => {
    const updatedTasks = [...tasks];
    updatedTasks[editingTaskIndex] = editedTask;
    setTasks(updatedTasks);
    setEditingTaskIndex(null); // Exit editing mode
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Project Task Generator</Text>
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
                <Text style={styles.taskTitle}>{`${task.stepNumber}: ${task.stepTitle}`}</Text>
              </TouchableOpacity>
              {expandedTaskIndex === index && (
                <View style={styles.taskDetails}>
                  {editingTaskIndex === index ? (
                    <>
                      <TextInput
                        style={styles.editInput}
                        value={editedTask.stepTitle}
                        onChangeText={(text) => setEditedTask({ ...editedTask, stepTitle: text })}
                      />
                      <TextInput
                        style={styles.editInput}
                        multiline
                        value={editedTask.description}
                        onChangeText={(text) => setEditedTask({ ...editedTask, description: text })}
                      />
                      <TextInput
                        style={styles.editInput}
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
    height: 100,
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
});
