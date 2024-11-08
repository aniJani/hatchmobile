import React, { useState } from "react";
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from "react-native";
import { createTaskDivision } from "../services/goalDivision"; // Correctly import the API function

export default function InitProject() {
  const [projectDescription, setProjectDescription] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerateTasks = async () => {
    if (!projectDescription.trim()) {
      alert("Please enter a project description.");
      return;
    }
  
    setLoading(true);
    try {
      const generatedTasks = await createTaskDivision(projectDescription);
  
      // Set tasks to the 'subtasks' array from the API response
      setTasks(generatedTasks.subtasks || []); // Use an empty array if 'subtasks' is undefined
    } catch (error) {
      console.error("Error generating tasks:", error);
      alert("Failed to generate tasks. Please try again.");
    } finally {
      setLoading(false);
    }
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
              <Text style={styles.taskTitle}>{`Step ${task.stepNumber}: ${task.stepTitle}`}</Text>
              <Text style={styles.taskDescription}>{task.description}</Text>
              <Text style={styles.taskTime}>{`Estimated Time: ${task.estimatedTime}`}</Text>
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
  taskDescription: {
    fontSize: 16,
    marginTop: 5,
  },
  taskTime: {
    fontSize: 14,
    marginTop: 5,
    color: "#666",
  },
});
