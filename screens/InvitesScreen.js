import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../contexts/auth";
import {
  getInvitationsByInvitee,
  updateInvitationStatus,
} from "../services/invitationServices";
import { editProjectById, getProjectById } from "../services/projectServices";

export default function InvitesScreen() {
  const { authData } = useAuth();
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedInvitationId, setSelectedInvitationId] = useState(null);
  const [projectLoading, setProjectLoading] = useState(false);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      setLoading(true);
      const invites = await getInvitationsByInvitee(authData.email);
      setInvitations(invites);
    } catch (error) {
      console.error("Error fetching invitations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvitationPress = async (invitation) => {
    try {
      setProjectLoading(true);
      setModalVisible(true);
      setSelectedInvitationId(invitation._id); // Set the selected invitation ID
      const projectData = await getProjectById(invitation.projectId._id);
      setSelectedProject(projectData);
    } catch (error) {
      console.error("Error fetching project details:", error);
    } finally {
      setProjectLoading(false);
    }
  };

  const handleAcceptInvitation = async () => {
    try {
      // Update the invitation status to 'accepted'
      await updateInvitationStatus(selectedInvitationId, "accepted");

      // Extract existing collaborator emails (excluding the owner)
      const existingCollaboratorEmails = selectedProject.collaborators
        .filter((collab) => collab.role !== "owner")
        .map((collab) => collab.email);

      // Add the new collaborator email
      const collaboratorEmails = [
        ...existingCollaboratorEmails,
        authData.email,
      ];

      // Prepare updated project data
      const updatedProject = {
        projectName: selectedProject.projectName,
        description: selectedProject.description,
        goals: selectedProject.goals,
        collaboratorEmails: collaboratorEmails,
      };

      // Use editProjectById to update the project
      await editProjectById(selectedProject._id, updatedProject);

      Alert.alert(
        "Success",
        "You have accepted the invitation and been added to the project."
      );

      // Refresh the invitations list
      fetchInvitations();
      setModalVisible(false);
      setSelectedProject(null);
      setSelectedInvitationId(null);
    } catch (error) {
      console.error("Error accepting invitation:", error);
      Alert.alert("Error", "Failed to accept the invitation.");
    }
  };

  const handleDeclineInvitation = async () => {
    try {
      // Update the invitation status to 'declined'
      await updateInvitationStatus(selectedInvitationId, "declined");

      Alert.alert("Invitation Declined", "You have declined the invitation.");

      // Refresh the invitations list
      fetchInvitations();
      setModalVisible(false);
      setSelectedProject(null);
      setSelectedInvitationId(null);
    } catch (error) {
      console.error("Error declining invitation:", error);
      Alert.alert("Error", "Failed to decline the invitation.");
    }
  };

  const renderInvitation = ({ item }) => (
    <TouchableOpacity onPress={() => handleInvitationPress(item)}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Project: {item.projectId.projectName}
        </Text>
        <Text style={styles.cardText}>Invited by: {item.inviterEmail}</Text>
        <Text style={styles.cardText}>Status: {item.status}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Invites</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <FlatList
          data={invitations}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderInvitation}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setSelectedProject(null);
          setSelectedInvitationId(null);
        }}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            {projectLoading ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : selectedProject ? (
              <>
                <ScrollView
                  style={{ maxHeight: "80%", width: "100%" }}
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                >
                  <Text style={styles.modalTitle}>
                    {selectedProject.projectName}
                  </Text>
                  <Text style={styles.modalDescription}>
                    {selectedProject.description}
                  </Text>

                  <Text style={styles.sectionTitle}>Goals:</Text>
                  {selectedProject.goals && selectedProject.goals.length > 0 ? (
                    selectedProject.goals.map((goal, index) => (
                      <View key={index} style={styles.goalContainer}>
                        <Text style={styles.goalTitle}>{goal.title}</Text>
                        <Text style={styles.cardText}>
                          Assigned To: {goal.assignedTo || "Unassigned"}
                        </Text>
                        <Text style={styles.cardText}>
                          Status: {goal.status || "Not Started"}
                        </Text>
                        <Text style={styles.cardText}>
                          Estimated Time: {goal.estimatedTime || "N/A"}
                        </Text>
                        <Text style={styles.cardText}>
                          Description: {goal.description || "No Description"}
                        </Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.cardText}>
                      No goals available for this project.
                    </Text>
                  )}
                </ScrollView>

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    onPress={handleAcceptInvitation}
                    style={styles.acceptButton}
                  >
                    <Text style={styles.buttonText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleDeclineInvitation}
                    style={styles.declineButton}
                  >
                    <Text style={styles.buttonText}>Decline</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(false);
                      setSelectedProject(null);
                      setSelectedInvitationId(null);
                    }}
                    style={styles.closeButton}
                  >
                    <Text style={styles.buttonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <Text style={styles.cardText}>Project not found.</Text>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 45,
    backgroundColor: "#000814",
  },
  title: { fontSize: 20, textAlign: "center", marginBottom: 20, color: "#fff" },
  card: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#0e1623",
    borderRadius: 8,
  },
  cardTitle: { fontSize: 18, color: "#fff" },
  cardText: { color: "rgba(255, 255, 255, 0.7)" },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0e1623",
  },
  modalContainer: {
    width: "90%",
    height: "90%",
    backgroundColor: "#1c2431", // Dark background for modal
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,

    marginBottom: 10,
    color: "#fff",
  },
  modalDescription: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.5)",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,

    marginTop: 15,
    marginBottom: 5,
    color: "#fff",
  },
  goalContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#1c2431", // Darker background for goals
    borderRadius: 5,
  },
  goalTitle: {
    fontSize: 16,

    color: "#fff",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-evenly", // Distribute the buttons evenly
    marginTop: 20,
    width: "100%", // Ensure buttons take up full width of the container
  },
  acceptButton: {
    padding: 10,
    backgroundColor: "#28a745", // Green for accept
    borderRadius: 5,
    width: "30%", // Width for the buttons
  },
  declineButton: {
    padding: 10,
    backgroundColor: "#dc3545", // Red for decline
    borderRadius: 5,
    width: "30%", // Width for the buttons
  },
  closeButton: {
    padding: 10,
    backgroundColor: "#555", // Dark gray for close
    borderRadius: 5,
    width: "30%", // Width for the buttons
  },
  buttonText: {
    color: "#fff", // Text color white
    textAlign: "center",
  },
});
