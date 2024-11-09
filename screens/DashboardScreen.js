import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Button, ActivityIndicator } from "react-native";
import { loadProjects, loadTasks } from "../services/projectServices";
import { useAuth } from "../contexts/auth";
import { getUserByEmail } from "../services/userServices";

export default function DashboardScreen({ navigation }) {
  const { authData, loading } = useAuth(); // Access authData from the auth context
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!loading && authData) {
      fetchUserData();
      fetchProjects();
      fetchTasks();
    }
  }, [loading, authData]);

  const fetchUserData = async () => {
    try {
      const data = await getUserByEmail(authData.email);
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const projectData = await loadProjects();
      setProjects(projectData);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

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
        onPress={() => navigation.navigate("ProjectDetail", { projectId: item._id })}
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

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      
      {!loading && authData && userData ? (
        <Text style={styles.email}>Welcome, {userData.name}!</Text>
      ) : (
        !loading && <Text style={styles.email}>Loading user data...</Text>
      )}

      <Text style={styles.sectionTitle}>Current Projects</Text>
      {projects.length === 0 ? (
        <Text>No projects available.</Text>
      ) : (
        <FlatList
          data={projects}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderProject}
        />
      )}

      <Text style={styles.sectionTitle}>Upcoming Tasks</Text>
      {tasks.length === 0 ? (
        <Text>No upcoming tasks.</Text>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderTask}
        />
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
  email: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
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
