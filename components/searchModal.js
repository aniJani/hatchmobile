import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SearchModal({ visible, onClose, onSearch, onSearchByEmail, searchResults, isSearching, hasSearched, navigation }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchMode, setSearchMode] = useState("keyword");

    useEffect(() => {
        if (!visible) {
            setSearchQuery("");
            setSearchMode("keyword");
        }
    }, [visible]);

    const handleSearch = () => {
        if (searchMode === "keyword") {
            onSearch(searchQuery);
        } else if (searchMode === "email") {
            onSearchByEmail(searchQuery);
        }
    };

    const handleModalClose = () => {
        setSearchQuery("");
        onClose();
    };

    return (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={handleModalClose}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    {/* Header with Close Icon */}
                    <View style={styles.buttonRow}>
                        <Text style={styles.modalTitle}>Search Collaborators</Text>
                        <TouchableOpacity style={styles.iconButton} onPress={handleModalClose}>
                            <MaterialIcons name="close" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {/* Mode Selector */}
                    <View style={styles.modeSelector}>
                        <TouchableOpacity
                            style={[styles.modeButton, searchMode === "keyword" && styles.activeModeButton]}
                            onPress={() => setSearchMode("keyword")}
                        >
                            <Text style={styles.modeButtonText}>Keyword</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modeButton, searchMode === "email" && styles.activeModeButton]}
                            onPress={() => setSearchMode("email")}
                        >
                            <Text style={styles.modeButtonText}>Email</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Search Input and Button */}
                    <View style={styles.buttonRow}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder={searchMode === "keyword" ? "Enter keyword..." : "Enter email address..."}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholderTextColor="#bbb"
                        />
                        <TouchableOpacity style={styles.iconButton} onPress={handleSearch}>
                            <MaterialIcons name="search" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {/* Loading Indicator or Search Results */}
                    {isSearching ? (
                        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 10 }} />
                    ) : hasSearched ? (
                        searchMode === "keyword" ? (
                            <FlatList
                                data={searchResults}
                                keyExtractor={(item) => item._id.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => {
                                            navigation.navigate("ColabProfilePage", { collaborator: item });
                                            handleModalClose();
                                        }}
                                    >
                                        <View style={styles.card}>
                                            <Text style={styles.cardTitle}>{item.name}</Text>
                                            <Text style={styles.cardText}>{item.email}</Text>
                                            <Text style={styles.cardText}>
                                                {Array.isArray(item.skills) && item.skills.length > 0
                                                    ? item.skills.join(", ")
                                                    : "No skills provided"}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                                ListEmptyComponent={<Text style={styles.cardText}>No results found.</Text>}
                            />
                        ) : searchMode === "email" ? (
                            searchResults ? (
                                <TouchableOpacity
                                    onPress={() => {
                                        navigation.navigate("ColabProfilePage", { collaborator: searchResults });
                                        handleModalClose();
                                    }}
                                >
                                    <View style={styles.card}>
                                        <Text style={styles.cardTitle}>{searchResults.name}</Text>
                                        <Text style={styles.cardText}>{searchResults.email}</Text>
                                        <Text style={styles.cardText}>
                                            {Array.isArray(searchResults.skills) && searchResults.skills.length > 0
                                                ? searchResults.skills.join(", ")
                                                : ""}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ) : (
                                <Text style={styles.cardText}>No user found with that email.</Text>
                            )
                        ) : null
                    ) : null}
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
        backgroundColor: "#272222",
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 20,
        marginBottom: 10,
        textAlign: "center",
        color: "#fff",
    },
    searchInput: {
        borderWidth: 1,
        borderColor: "#444",
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        color: "#fff",
        width: 280,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 15,
        alignItems: 'center',
    },
    iconButton: {
        padding: 10,
    },
    card: {
        padding: 15,
        marginBottom: 10,
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderRadius: 8,
    },
    cardTitle: {
        fontSize: 16,
        color: "#fff",
    },
    cardText: {
        fontSize: 14,
        color: "rgba(255, 255, 255, 0.5)",
    },
    modeSelector: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 15,
    },
    modeButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: "#444",
        borderRadius: 5,
        marginHorizontal: 5,
    },
    activeModeButton: {
        backgroundColor: "#555",
    },
    modeButtonText: {
        color: "#fff",
        fontSize: 16,
    },
});
