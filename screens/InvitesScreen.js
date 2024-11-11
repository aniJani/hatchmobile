import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth } from "../contexts/auth";
import { getInvitationsByInvitee } from "../services/invitationServices";
import { getProjectById } from '../services/projectServices';

export default function InvitesScreen() {
    const { authData } = useAuth();
    const [invitations, setInvitations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
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

    const handleInvitationPress = async (projectId) => {
        try {
            setProjectLoading(true);
            setModalVisible(true);
            const projectData = await getProjectById(projectId);
            setSelectedProject(projectData);
        } catch (error) {
            console.error("Error fetching project details:", error);
        } finally {
            setProjectLoading(false);
        }
    };

    const renderInvitation = ({ item }) => (
        <TouchableOpacity
            onPress={() => handleInvitationPress(item.projectId._id)}
        >
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Project: {item.projectId.projectName}</Text>
                <Text>Invited by: {item.inviterEmail}</Text>
                <Text>Status: {item.status}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Invites</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
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
                }}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        {projectLoading ? (
                            <ActivityIndicator size="large" color="#0000ff" />
                        ) : selectedProject ? (
                            <>
                                <ScrollView style={{ maxHeight: '80%', width: '100%' }}>
                                    <Text style={styles.modalTitle}>{selectedProject.projectName}</Text>
                                    <Text style={styles.modalDescription}>{selectedProject.description}</Text>

                                    <Text style={styles.sectionTitle}>Goals:</Text>
                                    {selectedProject.goals && selectedProject.goals.length > 0 ? (
                                        selectedProject.goals.map((goal, index) => (
                                            <View key={index} style={styles.goalContainer}>
                                                <Text style={styles.goalTitle}>{goal.title}</Text>
                                                <Text>Assigned To: {goal.assignedTo || 'Unassigned'}</Text>
                                                <Text>Status: {goal.status || 'Not Started'}</Text>
                                                <Text>Estimated Time: {goal.estimatedTime || 'N/A'}</Text>
                                                <Text>Description: {goal.description || 'No Description'}</Text>
                                            </View>
                                        ))
                                    ) : (
                                        <Text>No goals available for this project.</Text>
                                    )}
                                </ScrollView>

                                <TouchableOpacity
                                    onPress={() => {
                                        setModalVisible(false);
                                        setSelectedProject(null);
                                    }}
                                    style={styles.closeButton}
                                >
                                    <Text style={styles.closeButtonText}>Close</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <Text>Project not found.</Text>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#fff" },
    title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
    card: { padding: 15, marginBottom: 10, backgroundColor: "#f9f9f9", borderRadius: 8 },
    cardTitle: { fontSize: 18, fontWeight: "bold" },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalDescription: {
        fontSize: 16,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 5,
    },
    goalContainer: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    goalTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#2196F3',
        borderRadius: 5,
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
