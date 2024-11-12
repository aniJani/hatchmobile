import React, { useEffect, useState, useRef } from "react";
import { ActivityIndicator, FlatList, View, StyleSheet } from "react-native";
import GoalCard from "./GoalCard"; // Import the GoalCard component
import { useAuth } from "../contexts/auth";
import { getProjectById } from "../services/projectServices";

export default function ProjectDetailScreen({ route, navigation }) {
  const [projects, setProjects] = useState([]);
  const { projectId } = route.params;
  const [loading, setLoading] = useState(true);

  const [expandedCards, setExpandedCards] = useState({});

  useEffect(() => {
    fetchProjectDetails();
  }, []);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const projectData = await getProjectById(projectId);
      setProject(projectData);
    } catch (error) {
      console.error("Error fetching project details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!projects) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load project details.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={projects.goals}
      horizontal
      keyExtractor={(item) => item._id.toString()}
      contentContainerStyle={styles.goalList}
      renderItem={({ item, index }) => (
        <GoalCard
          item={item}
          index={index}
          expandedCards={expandedCards}
          toggleExpand={toggleExpand}
        />
      )}
      showsHorizontalScrollIndicator={false}
    />
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1a1a2e", // Dark background color
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
    marginBottom: 15,
  },
  projectTitleContainer: {
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 20,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  goalsContainer: {
    marginTop: 10,
    flex: 1,
  },
  goalList: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  goalCard: {
    width: 280,
    borderRadius: 16,
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#2d2d44", // Darker card color
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginRight: 16, // Spacing for horizontal scrolling
  },
  goalTextContainer: {
    marginBottom: 10,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  goalSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
  },
  statusContainer: {
    flexDirection: "row",
    marginVertical: 10,
  },
  statusButton: {
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 8,
  },
  activeStatus: {
    backgroundColor: "#3A78F2", // Highlighted color for active status
  },
  inactiveStatus: {
    backgroundColor: "#2B2B3A", // Muted color for inactive status
  },
  statusText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  addButton: {
    alignSelf: "flex-end",
    padding: 10,
    borderRadius: 50,
    backgroundColor: "#4A4A6A", // Color for add button
    marginTop: 10,
  },
  expandedContent: {
    marginTop: 10,
  },
  detailText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    marginVertical: 2,
  },
  assignContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    color: "#fff",
    backgroundColor: "#2d2d44",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  chatButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#28a745",
    borderRadius: 30,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  chatButtonText: {
    color: "#fff",
    marginLeft: 10,
    fontSize: 16,
  },
});
