// DashboardScreen.js

import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
      const sortedProjects = projectData.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setProjects(sortedProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const suggestCollaborators = async () => {
    try {
      const query =
        userData.description ||
        (Array.isArray(userData.skills) ? userData.skills.join(", ") : "");
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
        onPress={() =>
          navigation.navigate("ProjectDetail", { projectId: item._id })
        }
      >
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.projectName}
        </Text>

        <Text style={styles.subText} numberOfLines={1}>
          {item.collaborators.find((collab) => collab.role === "owner")
            ?.email || "Unknown"}
        </Text>

        <Text style={styles.subText} numberOfLines={6}>
          {item.description}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderCollaborator = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("ColabProfilePage", { collaborator: item })
      }
    >
      <View style={styles.card}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.name}
        </Text>

        <Text style={styles.subText} numberOfLines={2}>
          {Array.isArray(item.skills)
            ? item.skills.join(", ")
            : "No skills provided"}
        </Text>

        <Text style={styles.subText} numberOfLines={6}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <View style={styles.avatarPlaceholder}>
          {/* Replace with actual user avatar */}
          <Text style={styles.avatarText}>👤</Text>
        </View>
        {/* Icons Container */}
        <View style={styles.iconsContainer}>
          {/* Invitation Icon */}
          <TouchableOpacity
            onPress={() => navigation.navigate("InvitesScreen")}
            style={styles.iconButton}
          >
            <Ionicons name="mail" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Organization Icon */}
          <TouchableOpacity
            onPress={() => navigation.navigate("OrganizationsScreen")}
            style={styles.iconButton}
          >
            <Ionicons name="business" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.headerContainer}>
        {loading && <ActivityIndicator size="large" color="#FFFFFF" />}

        {!loading && authData && userData ? (
          <Text style={styles.username}> {userData.name}</Text>
        ) : (
          !loading && <Text style={styles.email}>Loading user data...</Text>
        )}
      </View>

      <Text style={styles.sectionTitle}>My Projects</Text>
      {projects.length === 0 ? (
        <Text style={styles.noDataText}>No projects available.</Text>
      ) : (
        <FlatList
          data={projects}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderProject}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listSpacing}
        />
      )}

      <View style={styles.collaboratorsHeader}>
        <Text style={styles.sectionTitle}>Suggested Collaborators</Text>
        <TouchableOpacity
          onPress={() => setIsModalVisible(true)}
          style={styles.iconButton}
        >
          <Ionicons name="search" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {suggestedCollaborators.length === 0 ? (
        <Text style={styles.noDataText}>No collaborators suggested.</Text>
      ) : (
        <FlatList
          data={suggestedCollaborators}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderCollaborator}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listSpacing}
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
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 30,
    backgroundColor: "#000814",
    paddingBottom: 80,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 40,
    backgroundColor: "#fffff9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
    marginTop: 15,
  },
  avatarText: {
    fontSize: 20,
    color: "#fff",
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  username: {
    fontSize: 20,
    marginTop: 20,
    textAlign: "center",
    marginBottom: 10,
    color: "#FFFFFF",
  },
  email: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 5,
    color: "#FFFFFF",
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: 1,
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
    color: "#FFFFFF",
  },
  noDataText: {
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 10,
  },
  card: {
    padding: 12,
    backgroundColor: "#0e1623",
    borderRadius: 15,
    marginRight: 15,
    width: 165,
    height: 200,
  },
  cardTitle: {
    fontSize: 16,
    color: "#FFFFFF",
    marginVertical: 5,
  },
  subText: {
    color: "rgba(255, 255, 255, 0.5)",
    margin: 2,
  },
  listSpacing: {
    paddingRight: 15,
  },
  collaboratorsHeader: {
    marginTop: -20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
