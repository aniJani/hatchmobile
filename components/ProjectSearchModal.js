// components/ProjectSearchModal.js
import React, { useEffect, useState } from "react";
import { Button, FlatList, Modal, StyleSheet, Text, View } from "react-native";
import { findUserMatch } from "../services/matchFinder";

export default function ProjectSearchModal({ visible, onClose, projectGoals }) {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Trigger search when the modal is opened
    if (visible) {
      handleSearchForMatches();
    }
  }, [visible]);

  const handleSearchForMatches = async () => {
    if (!projectGoals || projectGoals.length === 0) return;

    try {
      setIsSearching(true);
      // Concatenate goals' titles and descriptions into a single query string
      const goalsQuery = projectGoals.map((goal) => `${goal.title} ${goal.description}`).join(" ");
      const results = await findUserMatch(goalsQuery);
      setSearchResults(results);
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
                <View style={styles.resultItem}>
                  <Text>{item.name}</Text>
                  <Text>{item.email}</Text>
                  <Text>{item.skills.join(", ")}</Text>
                </View>
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
