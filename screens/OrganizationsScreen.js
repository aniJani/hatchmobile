// OrganizationsScreen.js

import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../contexts/auth';
import {
    createOrganization,
    getUserOrganizations,
    joinOrganization, // Import the joinOrganization function
} from '../services/organizationServices'; // Import your service functions

export default function OrganizationsScreen({ navigation }) {
    const { authData } = useAuth();
    const [organizations, setOrganizations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // State for Create Organization Modal
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [orgName, setOrgName] = useState('');
    const [createMessage, setCreateMessage] = useState('');

    // State for Join Organization Modal
    const [isJoinModalVisible, setIsJoinModalVisible] = useState(false);
    const [inviteCode, setInviteCode] = useState('');
    const [joinMessage, setJoinMessage] = useState('');

    useEffect(() => {
        fetchOrganizations();
    }, []);

    const fetchOrganizations = async () => {
        setIsLoading(true);
        try {
            const orgs = await getUserOrganizations(authData.email);
            setOrganizations(orgs);
        } catch (error) {
            console.error('Error fetching organizations:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateOrganization = async () => {
        if (orgName.trim() === '') {
            setCreateMessage('Organization name cannot be empty.');
            return;
        }
        try {
            const response = await createOrganization(authData.email, orgName);
            setCreateMessage(response.message);
            setIsCreateModalVisible(false);
            setOrgName('');
            // Refresh the list of organizations
            fetchOrganizations();
        } catch (error) {
            console.error('Error creating organization:', error);
            setCreateMessage('Failed to create organization.');
        }
    };

    const handleJoinOrganization = async () => {
        if (inviteCode.trim() === '') {
            setJoinMessage('Invite code cannot be empty.');
            return;
        }
        try {
            const response = await joinOrganization(authData.email, inviteCode);
            setJoinMessage(response.message);
            setIsJoinModalVisible(false);
            setInviteCode('');
            // Refresh the list of organizations
            fetchOrganizations();
        } catch (error) {
            console.error('Error joining organization:', error);
            setJoinMessage(error.message || 'Failed to join organization.');
        }
    };

    const renderOrganization = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('OrganizationDetail', { organization: item })}
        >
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.subText}>Invite Code: {item.inviteCode}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Organizations</Text>

            {/* Buttons Container */}
            <View style={styles.buttonsContainer}>
                {/* Create Organization Button */}
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => setIsCreateModalVisible(true)}
                >
                    <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" />
                    <Text style={styles.buttonText}>Create Organization</Text>
                </TouchableOpacity>

                {/* Join Organization Button */}
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => setIsJoinModalVisible(true)}
                >
                    <Ionicons name="log-in-outline" size={24} color="#FFFFFF" />
                    <Text style={styles.buttonText}>Join Organization</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Your Organizations</Text>

            {isLoading ? (
                <ActivityIndicator size="large" color="#FFFFFF" />
            ) : organizations.length === 0 ? (
                <Text style={styles.noDataText}>You have not joined any organizations yet.</Text>
            ) : (
                <FlatList
                    data={organizations}
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={renderOrganization}
                />
            )}

            {/* Modal for Creating Organization */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isCreateModalVisible}
                onRequestClose={() => setIsCreateModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Create a New Organization</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Organization Name"
                            placeholderTextColor="#bbb"
                            value={orgName}
                            onChangeText={setOrgName}
                        />
                        {createMessage ? <Text style={styles.message}>{createMessage}</Text> : null}
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.modalButton} onPress={handleCreateOrganization}>
                                <Text style={styles.modalButtonText}>Create</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => {
                                    setIsCreateModalVisible(false);
                                    setCreateMessage('');
                                }}
                            >
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal for Joining Organization */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isJoinModalVisible}
                onRequestClose={() => setIsJoinModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Join an Organization</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Invite Code"
                            placeholderTextColor="#bbb"
                            value={inviteCode}
                            onChangeText={setInviteCode}
                        />
                        {joinMessage ? <Text style={styles.message}>{joinMessage}</Text> : null}
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.modalButton} onPress={handleJoinOrganization}>
                                <Text style={styles.modalButtonText}>Join</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => {
                                    setIsJoinModalVisible(false);
                                    setJoinMessage('');
                                }}
                            >
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
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
        backgroundColor: "#272222",
    },
    title: {
        fontSize: 24,
        color: "#FFFFFF",
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        color: "#FFFFFF",
        marginTop: 20,
        marginBottom: 10,
    },
    noDataText: {
        color: "#FFFFFF",
        textAlign: 'center',
        marginTop: 10,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#444",
        padding: 10,
        borderRadius: 8,
        flex: 1,
        marginRight: 10,
    },
    buttonText: {
        color: "#FFFFFF",
        marginLeft: 10,
        fontSize: 16,
    },
    card: {
        padding: 15,
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderRadius: 8,
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 16,
        color: "#FFFFFF",
        marginBottom: 5,
    },
    subText: {
        color: "rgba(255, 255, 255, 0.7)",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: "90%",
        padding: 20,
        backgroundColor: "#272222",
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 20,
        marginBottom: 10,
        textAlign: "center",
        color: "#fff",
    },
    input: {
        borderWidth: 1,
        borderColor: "#444",
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        color: "#fff",
    },
    message: {
        color: "#fff",
        marginBottom: 10,
        textAlign: "center",
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-around",
    },
    modalButton: {
        backgroundColor: "#444",
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginHorizontal: 5,
    },
    modalButtonText: {
        color: "#fff",
        textAlign: "center",
        fontSize: 16,
    },
    cancelButton: {
        backgroundColor: "#777",
    },
});

