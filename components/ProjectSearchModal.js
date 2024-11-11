// components/ProjectSearchModal.js
import React, { useEffect, useState } from "react";
import { Button, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../contexts/auth"; // Import useAuth to get the logged-in user ID
import { findUserMatch } from "../services/matchFinder";

export default function ProjectSearchModal({ visible, onClose, projectId, projectGoals, projectCollaborators, navigation }) {
  const { authData } = useAuth(); // Access the logged-in user's data
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (visible) {
      handleSearchForMatches();
    } else {
      // Clear search results when the modal is closed
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
            <Text>Loading...</Text>
          ) : (
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item._id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => {
                  navigation.navigate("ColabProfilePage", { collaborator: item });
                  onClose(); // Close and reset modal on navigation
                }}>
                  <View style={styles.resultItem}>
                    <Text>{item.name}</Text>
                    <Text>{item.email}</Text>
                    <Text>{item.skills.join(", ")}</Text>
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={<Text>No results found.</Text>}
            />
          )}
          <Button title="Close" onPress={onClose} />
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
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
