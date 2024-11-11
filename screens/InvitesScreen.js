// screens/InvitesScreen.js
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../contexts/auth";
import { getInvitationsByInvitee } from "../services/invitationServices"; // Import the service to fetch invites

export default function InvitesScreen() {
    const { authData } = useAuth(); // Access the logged-in user's data
    const [invitations, setInvitations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInvitations();
    }, []);

    const fetchInvitations = async () => {
        try {
            setLoading(true);
            const invites = await getInvitationsByInvitee(authData.email); // Fetch invites using the user’s email
            setInvitations(invites);
        } catch (error) {
            console.error("Error fetching invitations:", error);
        } finally {
            setLoading(false);
        }
    };

    const renderInvitation = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Project: {item.projectName}</Text>
            <Text>Invited by: {item.inviterEmail}</Text>
            <Text>Status: {item.status}</Text>
        </View>
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#fff" },
    title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
    card: { padding: 15, marginBottom: 10, backgroundColor: "#f9f9f9", borderRadius: 8 },
    cardTitle: { fontSize: 18, fontWeight: "bold" },
});
