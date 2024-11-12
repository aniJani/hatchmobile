import React, { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { findUserMatch } from "../services/matchFinder";

export default function CollaboratorSelectionModal({
  visible,
  onClose,
  projectCollaborators,
  goalDescription,
  onSelectCollaborator,
  navigation,
}) {
  const [collaborators, setCollaborators] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [scope, setScope] = useState("internal");

  useEffect(() => {
    if (visible) {
      loadCollaborators(scope);
    }
  }, [visible, scope]);

  const loadCollaborators = async (scope) => {
    setIsFetching(true);
    try {
      let results = [];
      if (scope === "internal") {
        results = projectCollaborators;
      } else {
        if (goalDescription) {
          results = await findUserMatch(goalDescription);
          results = results.filter(
            (user) =>
              !projectCollaborators.some(
                (collaborator) => collaborator.email === user.email
              )
          );
        } else {
          console.warn("Goal description is missing.");
        }
      }
      setCollaborators(results);
    } catch (error) {
      console.error("Error loading collaborators:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleCollaboratorSelect = (item) => {
    if (scope === "internal") {
      onSelectCollaborator(item.email);
      onClose();
    } else {
      navigation.navigate("ColabProfilePage", { collaborator: item });
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Assign Collaborator</Text>
          <View style={styles.scopeToggleContainer}>
            <TouchableOpacity onPress={() => setScope("internal")}>
              <Text
                style={[
                  styles.scopeText,
                  scope === "internal" && styles.activeScope,
                ]}
              >
                Internal
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setScope("external")}>
              <Text
                style={[
                  styles.scopeText,
                  scope === "external" && styles.activeScope,
                ]}
              >
                External
              </Text>
            </TouchableOpacity>
          </View>

          {isFetching ? (
            <Text style={styles.whiteText}>Loading collaborators...</Text>
          ) : (
            <FlatList
              data={collaborators}
              keyExtractor={(item) => item.email}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleCollaboratorSelect(item)}
                >
                  <View style={styles.collaboratorItem}>
                    <Text style={styles.whiteText}>
                      {item.name || "Collaborator"}
                    </Text>
                    <Text style={styles.whiteText}>{item.email}</Text>
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.whiteText}>No collaborators found.</Text>
              }
            />
          )}
          <Button title="Close" onPress={onClose} color="#fff" />
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
    backgroundColor: "#1c2431",
    width: "80%",
    maxHeight: "80%",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 16,
    color: "#fff",

    textAlign: "center",
    marginBottom: 10,
  },
  scopeToggleContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  scopeText: {
    fontSize: 16,
    color: "#fff", // White text color
  },
  activeScope: {
    color: "#fff", // White text color
  },
  collaboratorItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
    textAlign: "center",
  },
  whiteText: {
    color: "#fff", // White text color
  },
});
