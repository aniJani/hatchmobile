import React, { useEffect, useState } from "react";
import { ActivityIndicator, Button, FlatList, StyleSheet, Text, View } from "react-native";
import SearchModal from "../components/searchModal"; // Import the SearchModal component
import { useAuth } from "../contexts/auth";
import { findUserMatch } from "../services/matchFinder";
import { loadProjects } from "../services/projectServices";
import { getUserByEmail } from "../services/userServices";
import { registerForPushNotificationsAsync } from "../services/notificationsService";
import * as Notifications from "expo-notifications";

export default function DashboardScreen({ navigation }) { 
  const { authData, loading } = useAuth();
  const [projects, setProjects] = useState([]);
  const [userData, setUserData] = useState(null);
  const [suggestedCollaborators, setSuggestedCollaborators] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!loading && authData) {
      fetchUserData();
      fetchProjects();
    }
  }, [loading, authData]);

  useEffect(() => {
    if (userData) {
      suggestCollaborators();
    }
  }, [userData]);

  // Register for push notifications
  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        // Optionally, send this token to your backend to store it for future notifications
      }
    });

    // Listener for incoming notifications
    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      console.log("Notification received:", notification);
    });

    // Listener for when the user interacts with a notification
    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("Notification response received:", response);
    });

    return () => {
      // Clean up listeners
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);
  
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
      const projectData = await loadProjects(authData.email);
      setProjects(projectData);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const suggestCollaborators = async () => {
    try {
      const query = userData.description || userData.skills.join(", ");
      const collaborators = await findUserMatch(query, userData._id);
      setSuggestedCollaborators(collaborators.slice(0, 5));
    } catch (error) {
      console.error("Error finding user match:", error);
    }
  };

  const handleSearch = async (query) => {
    if (query.trim() === "") return;
    setIsSearching(true);
    try {
      const results = await findUserMatch(query, userData._id);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching collaborators:", error);
    } finally {
      setIsSearching(false);
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

  const renderCollaborator = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text>Email: {item.email}</Text>
      <Text>Description: {item.description}</Text>
      <Text>Skills: {item.skills.join(", ")}</Text>
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
          horizontal={true} // Enable horizontal scrolling
          showsHorizontalScrollIndicator={false}
        />
      )}

      <View style={styles.collaboratorsHeader}>
        <Text style={styles.sectionTitle}>Suggested Collaborators</Text>
        <Button title="Search" onPress={() => setIsModalVisible(true)} />
      </View>

      {suggestedCollaborators.length === 0 ? (
        <Text>No collaborators suggested.</Text>
      ) : (
        <FlatList
          data={suggestedCollaborators}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderCollaborator}
          horizontal={true} // Enable horizontal scrolling
          showsHorizontalScrollIndicator={false}
        />
      )}

      {/* Use SearchModal Component */}
      <SearchModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSearch={handleSearch}
        searchResults={searchResults}
        isSearching={isSearching}
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
  collaboratorsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 10,
  },
  card: {
    padding: 15,
    marginRight: 10, // Add margin to separate the cards horizontally
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    width: 250, // Set a fixed width for horizontal scrolling
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
