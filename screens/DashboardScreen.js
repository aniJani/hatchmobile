import React, { useEffect, useState } from "react";
import { ActivityIndicator, Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import SearchModal from "../components/searchModal";
import { useAuth } from "../contexts/auth";
import { findUserMatch } from "../services/matchFinder";
import { loadProjects } from "../services/projectServices";
import { getUserByEmail } from "../services/userServices";

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
    <TouchableOpacity onPress={() => navigation.navigate("ColabProfilePage", { collaborator: item })}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text>Email: {item.email}</Text>
        <Text>Description: {item.description}</Text>
        <Text>Skills: {item.skills.join(", ")}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      {/* Separate Invites button */}
      <Button
        title="View Invites"
        onPress={() => navigation.navigate("InvitesScreen")}
        color="#007AFF"
      />

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
        />
      )}

      <SearchModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSearch={handleSearch}
        searchResults={searchResults}
        isSearching={isSearching}
        navigation={navigation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  email: { fontSize: 16, textAlign: "center", marginBottom: 10 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginTop: 20, marginBottom: 10 },
  collaboratorsHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 10, marginBottom: 10 },
  card: { padding: 15, marginBottom: 10, backgroundColor: "#f9f9f9", borderRadius: 8 },
  cardTitle: { fontSize: 18, fontWeight: "bold" },
});
