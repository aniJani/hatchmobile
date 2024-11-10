// components/CollaboratorSelectionModal.js
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
    projectDescription,
    onSelectCollaborator,
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
                const query = projectDescription;
                results = await findUserMatch(query);
                results = results.filter(
                    (user) => !projectCollaborators.some((collaborator) => collaborator.email === user.email)
                );
            }
            setCollaborators(results);
        } catch (error) {
            console.error("Error loading collaborators:", error);
        } finally {
            setIsFetching(false);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Assign Collaborator</Text>
                    <View style={styles.scopeToggleContainer}>
                        <TouchableOpacity onPress={() => setScope("internal")}>
                            <Text style={[styles.scopeText, scope === "internal" && styles.activeScope]}>Internal</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setScope("external")}>
                            <Text style={[styles.scopeText, scope === "external" && styles.activeScope]}>External</Text>
                        </TouchableOpacity>
                    </View>

                    {isFetching ? (
                        <Text>Loading collaborators...</Text>
                    ) : (
                        <FlatList
                            data={collaborators}
                            keyExtractor={(item) => item.email}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => onSelectCollaborator(item.email)}>
                                    <View style={styles.collaboratorItem}>
                                        <Text>{item.name}</Text>
                                        <Text>{item.email}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={<Text>No collaborators found.</Text>}
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
        fontSize: 20,
        fontWeight: "bold",
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
        color: "#2196F3",
    },
    activeScope: {
        fontWeight: "bold",
        color: "#000",
    },
    collaboratorItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        textAlign: "center",
    },
});
