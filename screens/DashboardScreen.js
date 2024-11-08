import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Button } from "react-native";
import axios from "axios";
import { loadProjects, loadTasks } from "../services/projectServices";

export default function DashboardScreen({ navigation }) {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  // Load data when the screen loads
  useEffect(() => {
    fetchProjects();
    fetchTasks();
  }, []);

  // Fetch projects using the service function
  const fetchProjects = async () => {
    try {
      const projectData = await loadProjects();
      setProjects(projectData);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  // Fetch tasks using the service function
  const fetchTasks = async () => {
    try {
      const taskData = await loadTasks();
      setTasks(taskData);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const renderProject = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text>{item.description}</Text>
      <Button
        title="View Project"
        onPress={() =>
          navigation.navigate("ProjectDetail", { projectId: item._id })
        }
      />
    </View>
  );

  const renderTask = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.taskName}</Text>
      <Text>Assigned to: {item.assignedTo}</Text>
      <Text>Due: {item.dueDate}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      <Text style={styles.sectionTitle}>Current Projects</Text>
      <FlatList
        data={projects}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderProject}
      />

      <Text style={styles.sectionTitle}>Upcoming Tasks</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderTask}
      />
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
