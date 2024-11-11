import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Import MaterialIcons for button icons

export default function SearchModal({ visible, onClose, onSearch, searchResults, isSearching, navigation }) {
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (!visible) {
            setSearchQuery(""); // Reset search query when modal is closed
        }
    }, [visible]);

    const handleSearch = () => {
        onSearch(searchQuery);
    };

    const handleModalClose = () => {
        setSearchQuery(""); // Clear the search query
        onClose();          // Close the modal
    };

    return (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={handleModalClose}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    

                    {/* Button Row with Icons */}
                    <View style={styles.buttonRow}>
                        <Text style={styles.modalTitle}>Search Collaborators</Text>

                        <TouchableOpacity style={styles.iconButton} onPress={handleModalClose}>
                            <MaterialIcons name="close" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    
                    {/* Button Row with Icons */}
                    <View style={styles.buttonRow}>

                        {/* Search Input */}
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Enter keyword..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#bbb"
                    />

                        <TouchableOpacity style={styles.iconButton} onPress={handleSearch}>
                            <MaterialIcons name="search" size={24} color="#fff" />
                        </TouchableOpacity>

                    </View>

                    {/* Loading or Search Results */}
                    {isSearching ? (
                        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 10 }} />
                    ) : (
                        <FlatList
                            data={searchResults}
                            keyExtractor={(item) => item._id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        navigation.navigate("ColabProfilePage", { collaborator: item });
                                        handleModalClose(); // Close modal on navigation
                                    }}
                                >
                                    <View style={styles.card}>
                                        <Text style={styles.cardTitle}>{item.name}</Text>
                                        <Text style={styles.cardText}>{item.email}</Text>
                                        <Text style={styles.cardText}>{item.skills.join(", ")}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={<Text style={styles.cardText}>No results found.</Text>}
                        />
                    )}
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
        height: '90%',
        padding: 20,
        backgroundColor: "#272222", // Dark background color
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
        color: "#fff", // White text color
    },
    searchInput: {
        borderWidth: 1,
        borderColor: "#444", // Darker border for input
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        color: "#fff", // White text color for input
        width: 280,
    },
    buttonRow: {
        flexDirection: "row", // Arrange buttons in a row
        justifyContent: "space-around", // Space out the buttons
        marginBottom: 15,
        alignContent: 'center',
        alignItems: 'center'
    },
    iconButton: {
        padding: 10,
    },
    card: {
        padding: 15,
        marginBottom: 10,
        backgroundColor: "#444", // Darker background for cards
        borderRadius: 8,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff", // White text color for card title
    },
    cardText: {
        fontSize: 14,
        color: "rgba(255, 255, 255, 0.7)", // Lighter white text color
    },
});
