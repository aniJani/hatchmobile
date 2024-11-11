import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../contexts/auth';
import {
    createOrganization,
    getOrganizationById,
    getUserOrganizations,
    joinOrganization,
} from '../services/organizationServices';

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

    // State for Organization Detail Modal
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [selectedOrganizationId, setSelectedOrganizationId] = useState(null);
    const [organizationDetails, setOrganizationDetails] = useState(null);
    const [isDetailLoading, setIsDetailLoading] = useState(false);

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

    const handleOrganizationPress = (organizationId) => {
        setSelectedOrganizationId(organizationId);
        setIsDetailModalVisible(true);
        fetchOrganizationDetails(organizationId);
    };

    const fetchOrganizationDetails = async (organizationId) => {
        setIsDetailLoading(true);
        try {
            const details = await getOrganizationById(organizationId);
            setOrganizationDetails(details);
        } catch (error) {
            console.error('Error fetching organization details:', error);
            setOrganizationDetails(null);
        } finally {
            setIsDetailLoading(false);
        }
    };

    const renderOrganization = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => handleOrganizationPress(item._id)}
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
            {/* ... existing create organization modal code ... */}

            {/* Modal for Joining Organization */}
            {/* ... existing join organization modal code ... */}

            {/* Modal for Organization Details */}
            <Modal
                animationType="slide"
                transparent={false} // Set transparent to false
                visible={isDetailModalVisible}
                onRequestClose={() => {
                    setIsDetailModalVisible(false);
                    setOrganizationDetails(null);
                }}
            >
                <View style={styles.container}>
                    {isDetailLoading ? (
                        <ActivityIndicator size="large" color="#FFFFFF" />
                    ) : organizationDetails ? (
                        <ScrollView>
                            <Text style={styles.title}>{organizationDetails.name}</Text>
                            <Text style={styles.detailText}>Invite Code: {organizationDetails.inviteCode}</Text>
                            <Text style={styles.sectionTitle}>Members:</Text>
                            {organizationDetails.members && organizationDetails.members.length > 0 ? (
                                organizationDetails.members.map((memberEmail, index) => (
                                    <Text key={index} style={styles.detailText}>
                                        {memberEmail}
                                    </Text>
                                ))
                            ) : (
                                <Text style={styles.detailText}>No members found.</Text>
                            )}
                            {/* Add any additional organization details you wish to display */}
                            <TouchableOpacity
                                style={[styles.modalButton, { marginTop: 20 }]}
                                onPress={() => {
                                    setIsDetailModalVisible(false);
                                    setOrganizationDetails(null);
                                }}
                            >
                                <Text style={styles.modalButtonText}>Close</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    ) : (
                        <Text style={styles.errorText}>Organization details not available.</Text>
                    )}
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
        alignSelf: 'center',
        width: '50%',
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
    detailText: {
        color: "#FFFFFF",
        fontSize: 16,
        marginBottom: 5,
    },
    errorText: {
        color: "#FFFFFF",
        fontSize: 18,
        textAlign: 'center',
    },
});
