import React, { useEffect, useState } from "react";
import { Button, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../contexts/auth";
import { findUserMatch } from "../services/matchFinder";

export default function ProjectSearchModal({ visible, onClose, projectId, projectGoals, projectCollaborators, navigation }) {
  const { authData } = useAuth();
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (visible) {
      handleSearchForMatches();
    } else {
      setSearchResults([]);
    }
  }, [visible]);

  const handleSearchForMatches = async () => {
    if (!projectGoals || projectGoals.length === 0) return;

    try {
      setIsSearching(true);
      const goalsQuery = projectGoals.map((goal) => `${goal.title} ${goal.description}`).join(" ");
      const results = await findUserMatch(goalsQuery, authData.userId);

      const filteredResults = results.filter(
        (user) => !projectCollaborators.some((collaborator) => collaborator.email === user.email)
      );

      setSearchResults(filteredResults);
    } catch (error) {
      console.error("Error finding user matches:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Suggested Collaborators</Text>

          {isSearching ? (
            <Text style={styles.whiteText}>Loading...</Text>
          ) : (
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item._id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => {
                  navigation.navigate("ColabProfilePage", { collaborator: item });
                  onClose();
                }}>
                  <View style={styles.resultItem}>
                    <Text style={styles.whiteText}>{item.name}</Text>
                    <Text style={styles.whiteText}>{item.email}</Text>
                    <Text style={styles.whiteText}>{item.skills.join(", ")}</Text>
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={<Text style={styles.whiteText}>No results found.</Text>}
            />
          )}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "#272222", // Dark background color
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#fff", // White text color
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#444", // Darker border color to match the theme
  },
  whiteText: {
    color: "#fff", // White text color
  },
  closeButton: {
    marginTop: 15,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff", // White text color
    fontWeight: "bold",
  },
});
