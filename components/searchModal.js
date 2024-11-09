// components/SearchModal.js
import React, { useState } from "react";
import { ActivityIndicator, Button, FlatList, Modal, StyleSheet, Text, TextInput, View } from "react-native";

export default function SearchModal({ visible, onClose, onSearch, searchResults, isSearching }) {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = () => {
        onSearch(searchQuery);
    };

    return (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Search Collaborators</Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Enter keyword..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <Button title="Search" onPress={handleSearch} />

                    {isSearching ? (
                        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 10 }} />
                    ) : (
                        <FlatList
                            data={searchResults}
                            keyExtractor={(item) => item._id.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.card}>
                                    <Text style={styles.cardTitle}>{item.name}</Text>
                                    <Text>Email: {item.email}</Text>
                                    <Text>Description: {item.description}</Text>
                                    <Text>Skills: {item.skills.join(", ")}</Text>
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
        width: "90%",
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
    searchInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    card: {
        padding: 15,
        marginBottom: 10,
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
});
