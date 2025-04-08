// SearchModal.js

import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../contexts/auth";
import {
  getOrganizationById,
  getUserOrganizations,
} from "../services/organizationServices";
import { getUserByEmail } from "../services/userServices";

export default function SearchModal({
  visible,
  onClose,
  onSearch,
  onSearchByEmail,
  searchResults,
  isSearching,
  hasSearched,
  navigation,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMode, setSearchMode] = useState("keyword");
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [organizationMembers, setOrganizationMembers] = useState([]);
  const { authData } = useAuth(); // Get user data

  useEffect(() => {
    if (!visible) {
      setSearchQuery("");
      setSearchMode("keyword");
      setSelectedOrganization(null);
      setOrganizationMembers([]);
    }
  }, [visible]);

  useEffect(() => {
    if (searchMode === "organizations") {
      fetchUserOrganizations();
    } else {
      // Reset when changing away from 'organizations' mode
      setSelectedOrganization(null);
      setOrganizationMembers([]);
    }
  }, [searchMode]);

  const fetchUserOrganizations = async () => {
    try {
      const orgs = await getUserOrganizations(authData.email);
      setOrganizations(orgs);
    } catch (error) {
      console.error("Error fetching user organizations:", error);
    }
  };

  const fetchOrganizationMembers = async (organizationId) => {
    try {
      const organization = await getOrganizationById(organizationId);

      // Exclude the user's own email from the members list
      const filteredMembers = organization.members.filter(
        (memberEmail) => memberEmail !== authData.email
      );

      setOrganizationMembers(filteredMembers);
    } catch (error) {
      console.error("Error fetching organization members:", error);
    }
  };

  const handleOrganizationSelect = (organization) => {
    setSelectedOrganization(organization);
    fetchOrganizationMembers(organization._id);
  };

  const handleMemberSelect = async (memberEmail) => {
    try {
      const user = await getUserByEmail(memberEmail);
      navigation.navigate("ColabProfilePage", { collaborator: user });
      handleModalClose();
    } catch (error) {
      console.error("Error fetching user by email:", error);
    }
  };

  const handleSearch = () => {
    if (searchMode === "keyword") {
      onSearch(searchQuery);
    } else if (searchMode === "email") {
      onSearchByEmail(searchQuery);
    }
  };

  const handleModalClose = () => {
    setSearchQuery("");
    setSelectedOrganization(null);
    setOrganizationMembers([]);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleModalClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Header with Close Icon */}
          <View style={styles.headerRow}>
            <Text style={styles.modalTitle}>Search Collaborators</Text>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleModalClose}
            >
              <MaterialIcons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Mode Selector */}
          <View style={styles.modeSelector}>
            <TouchableOpacity
              style={[
                styles.modeButton,
                searchMode === "keyword" && styles.activeModeButton,
              ]}
              onPress={() => setSearchMode("keyword")}
            >
              <Text style={styles.modeButtonText}>Keyword</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modeButton,
                searchMode === "email" && styles.activeModeButton,
              ]}
              onPress={() => setSearchMode("email")}
            >
              <Text style={styles.modeButtonText}>Email</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modeButton,
                searchMode === "organizations" && styles.activeModeButton,
              ]}
              onPress={() => setSearchMode("organizations")}
            >
              <Text style={styles.modeButtonText}>Organizations</Text>
            </TouchableOpacity>
          </View>

          {/* Content Based on Mode */}
          {searchMode === "keyword" || searchMode === "email" ? (
            <>
              {/* Search Input and Button */}
              <View style={styles.searchRow}>
                <TextInput
                  style={styles.searchInput}
                  placeholder={
                    searchMode === "keyword"
                      ? "Enter keyword..."
                      : "Enter email address..."
                  }
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholderTextColor="#bbb"
                />
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={handleSearch}
                >
                  <MaterialIcons name="search" size={24} color="#fff" />
                </TouchableOpacity>
              </View>

              {/* Loading Indicator or Search Results */}
              {isSearching ? (
                <ActivityIndicator
                  size="large"
                  color="#fff"
                  style={{ marginTop: 10 }}
                />
              ) : hasSearched ? (
                searchMode === "keyword" ? (
                  <FlatList
                    data={searchResults}
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate("ColabProfilePage", {
                            collaborator: item,
                          });
                          handleModalClose();
                        }}
                      >
                        <View style={styles.card}>
                          <Text style={styles.cardTitle}>{item.name}</Text>
                          <Text style={styles.cardText}>{item.email}</Text>
                          <Text style={styles.cardText}>
                            {Array.isArray(item.skills) &&
                            item.skills.length > 0
                              ? item.skills.join(", ")
                              : "No skills provided"}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                      <Text style={styles.cardText}>No results found.</Text>
                    }
                  />
                ) : searchMode === "email" ? (
                  searchResults ? (
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("ColabProfilePage", {
                          collaborator: searchResults,
                        });
                        handleModalClose();
                      }}
                    >
                      <View style={styles.card}>
                        <Text style={styles.cardTitle}>
                          {searchResults.name}
                        </Text>
                        <Text style={styles.cardText}>
                          {searchResults.email}
                        </Text>
                        <Text style={styles.cardText}>
                          {Array.isArray(searchResults.skills) &&
                          searchResults.skills.length > 0
                            ? searchResults.skills.join(", ")
                            : ""}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <Text style={styles.cardText}>
                      No user found with that email.
                    </Text>
                  )
                ) : null
              ) : null}
            </>
          ) : searchMode === "organizations" ? (
            selectedOrganization === null ? (
              // Display list of organizations
              <FlatList
                data={organizations}
                keyExtractor={(item) => item._id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleOrganizationSelect(item)}
                  >
                    <View style={styles.card}>
                      <Text style={styles.cardTitle}>{item.name}</Text>
                    </View>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <Text style={styles.cardText}>No organizations found.</Text>
                }
              />
            ) : (
              // Display list of members
              <View style={styles.membersContainer}>
                {/* Back button to go back to organizations list */}
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => {
                    setSelectedOrganization(null);
                    setOrganizationMembers([]);
                  }}
                >
                  <Text style={styles.backButtonText}>
                    Back to Organizations
                  </Text>
                </TouchableOpacity>
                <Text style={styles.sectionTitle}>
                  {selectedOrganization.name} Members
                </Text>
                <FlatList
                  data={organizationMembers}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleMemberSelect(item)}>
                      <View style={styles.card}>
                        <Text style={styles.cardTitle}>{item}</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={
                    <Text style={styles.cardText}>
                      No members apart from you.
                    </Text>
                  }
                />
              </View>
            )
          ) : null}
        </View>
      </View>
    </Modal>
  );
} // <-- Added this closing brace

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000814",
  },
  modalContent: {
    width: "90%",
    height: "90%",
    padding: 20,
    backgroundColor: "#000814",
    borderRadius: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: "center",
    color: "#fff",
  },
  modeSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: 15,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 5,
    marginHorizontal: 5,
    marginVertical: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  activeModeButton: {
    backgroundColor: "#1c2431",
  },
  modeButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#444",
    padding: 10,
    borderRadius: 5,
    color: "#fff",
    marginRight: 10,
  },
  iconButton: {
    padding: 10,
  },
  card: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#1c2431",
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
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#444",
    borderRadius: 5,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    color: "#FFFFFF",
    marginBottom: 10,
  },
  membersContainer: {
    flex: 1,
  },
});
