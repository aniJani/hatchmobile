import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect
import React, { useCallback, useEffect, useState } from "react";
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
  const [hasSearched, setHasSearched] = useState(false);

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setHasSearched(false); // Reset hasSearched
    setSearchResults(null); // Reset searchResults if necessary
  };

  const handleSearchByEmail = async (email) => {
    setIsSearching(true);
    setHasSearched(true);
    try {
      const user = await getUserByEmail(email);
      setSearchResults(user); // Since the result is a single user object
    } catch (error) {
      console.error("Error fetching user by email:", error);
      setSearchResults(null); // Set to null if user not found or error occurs
    } finally {
      setIsSearching(false);
    }
  };


  // Use useFocusEffect to fetch data when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (authData) {
        fetchUserData();
        fetchProjects();
      }
    }, [authData])
  );

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

      // Sort projects by date, showing the newest project first
      const sortedProjects = projectData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setProjects(sortedProjects);
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
    setHasSearched(true);
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

  const renderProject = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("ProjectDetail", { projectId: item._id })}
      >
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.projectName}
        </Text>

        <Text style={styles.subText} numberOfLines={1}>
          {item.collaborators.find((collab) => collab.role === "owner")?.email || "Unknown"}
        </Text>

        <Text style={styles.subText} numberOfLines={6}>
          {item.description}
        </Text>

      </TouchableOpacity>
    );
  };


  const renderCollaborator = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate("ColabProfilePage", { collaborator: item })}>
      <View style={styles.card}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.name}
        </Text>

        <Text style={styles.subText} numberOfLines={2}>
          {item.skills.join(", ")}
        </Text>
        <Text style={styles.subText} numberOfLines={6}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {loading && <ActivityIndicator size="large" color="#FFFFFF" />}

        {!loading && authData && userData ? (
          <Text style={styles.username}>Welcome, {userData.name}!</Text>
        ) : (
          !loading && <Text style={styles.email}>Loading user data...</Text>
        )}

        {/* Updated "View Invites" button with icon */}
        <TouchableOpacity onPress={() => navigation.navigate("InvitesScreen")} style={styles.inviteButton}>
          <Ionicons name="mail" size={24} color="#FFFFFF" style={styles.inviteIcon} />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Current Projects</Text>
      {projects.length === 0 ? (
        <Text>No projects available.</Text>
      ) : (
        <FlatList
          data={projects}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderProject}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listSpacing} // Added spacing
        />
      )}

      <View style={styles.collaboratorsHeader}>
        <Text style={styles.sectionTitle}>Suggested Collaborators</Text>
        <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.iconButton}>
          <Ionicons name="search" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {suggestedCollaborators.length === 0 ? (
        <Text>No collaborators suggested.</Text>
      ) : (
        <FlatList
          data={suggestedCollaborators}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderCollaborator}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listSpacing} // Added spacing
        />
      )}

      <SearchModal
        visible={isModalVisible}
        onClose={handleCloseModal}
        onSearch={handleSearch}
        searchResults={searchResults}
        onSearchByEmail={handleSearchByEmail}
        isSearching={isSearching}
        hasSearched={hasSearched}
        navigation={navigation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 45, backgroundColor: "#272222", paddingBottom: 80 },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  title: { fontSize: 20, textAlign: "center", marginBottom: 20, color: "#FFFFFF" },
  username: { fontSize: 20, textAlign: "center", marginBottom: 10, color: "#FFFFFF" }, // Increased font size
  email: { fontSize: 16, textAlign: "center", marginBottom: 5, color: "#FFFFFF" },
  sectionTitle: { fontSize: 18, marginTop: 20, marginBottom: 10, color: "#FFFFFF" }, // Reduced marginBottom to 5
  inviteButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 10 },
  inviteIcon: { marginRight: 8 },

  collaboratorsHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }, // Reduced marginBottom to 5
  card: {
    padding: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 15,
    marginRight: 15,
    width: 165, // Fixed width
    height: 200, // Increased height
  },
  cardTitle: { fontSize: 16, color: "#FFFFFF", marginVertical: 5 },
  subText: { color: "rgba(255, 255, 255, 0.5)", margin: 2 },
  iconButton: { padding: 10, backgroundColor: "transparent", borderRadius: 8 },
  listSpacing: { paddingRight: 15 }, // Added padding for spacing between items
});

