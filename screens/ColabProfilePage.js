// screens/ColabProfilePage.js
import React, { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Import MaterialIcons for button icons
import { useAuth } from "../contexts/auth"; // Import auth context
import { sendInvitation } from "../services/invitationServices";
import { loadProjects } from "../services/projectServices"; // Use loadProjects to fetch owned projects

export default function ColabProfilePage({ route, navigation }) {
    const { collaborator } = route.params;
    const [ownedProjects, setOwnedProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null); // To store project details when tapped
    const { authData } = useAuth(); // Fetch current user data from auth context

    useEffect(() => {
        if (authData) {
            fetchOwnedProjects(); // Use authData for owned projects
        }
    }, [authData]);

    const fetchOwnedProjects = async () => {
        try {
            const projects = await loadProjects(authData.email); // Use authData.email
            setOwnedProjects(projects);
        } catch (error) {
            console.error("Error fetching owned projects:", error);
        }
    };

    const handleInvite = async () => {
        if (!selectedProject) {
            Alert.alert("Error", "Please select a project to send an invitation.");
            return;
        }

        try {
            await sendInvitation({
                projectId: selectedProject._id,
                inviterEmail: authData.email, // Use authData.email as inviterEmail
                inviteeEmail: collaborator.email, // Use collaborator's email as inviteeEmail
            });
            Alert.alert("Success", "Invitation sent successfully!");
            navigation.goBack();
        } catch (error) {
            Alert.alert("Error", "Failed to send invitation. Try again.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.name}>{collaborator.name}</Text>
            <Text style={styles.text}>Email: {collaborator.email}</Text>
            <Text style={styles.text}>Skills: {collaborator.skills.join(", ")}</Text>

            <Text style={styles.sectionTitle}>Select a project to send an invite:</Text>
            <FlatList
                data={ownedProjects}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => setSelectedProject(item)}>
                        <View style={styles.projectCard}>
                            <Text style={styles.projectName}>{item.projectName}</Text>
                            <Text style={styles.projectDescription}>{item.description}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />

            {selectedProject && (
                <View style={styles.projectDetails}>
                    
                    <Text style={styles.projectDetailsTitle}>{selectedProject.projectName}</Text>
                    <Text style={styles.text}>Description: {selectedProject.description}</Text>

                    <TouchableOpacity
                        onPress={handleInvite}
                        style={styles.inviteButton}
                    >
                        <MaterialIcons name="send" size={20} color="#fff" />
                        <Text style={styles.inviteButtonText}>Send Invite</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, paddingTop: 45, backgroundColor: "#272222" },
    name: { fontSize: 20, marginBottom: 10, color: "#fff" },
    text: { fontSize: 16, color: "rgba(255, 255, 255, 0.7)", marginBottom: 5 },
    sectionTitle: { fontSize: 18, marginTop: 20, marginBottom: 10, color: "#fff" },
    
    projectCard: {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: 8,
        padding: 15,
        marginVertical: 8,
    },
    projectName: { fontSize: 16,  color: "#fff" },
    projectDescription: { fontSize: 14, color: "rgba(255, 255, 255, 0.7)", marginTop: 5 },

    projectDetails: {
        marginTop: 20,
        padding: 15,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: 8,
    },
    projectDetailsTitle: {
        fontSize: 18,
        
        marginBottom: 10,
        color: "#fff",
    },

    inviteButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        backgroundColor: "#1640D6",
        borderRadius: 5,
        marginTop: 15,
    },
    inviteButtonText: {
        color: "#fff",
        
        marginLeft: 5,
    },
});
