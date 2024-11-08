import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import axios from "axios";

export default function AddMemberScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/users/search`, {
        params: { query: searchQuery },
      });
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const renderUser = ({ item }) => (
    <View style={styles.userCard}>
      <Text style={styles.userName}>{item.name}</Text>
      <Text style={styles.userSkill}>Skill: {item.skill}</Text>
      <Text style={styles.userProject}>Project: {item.project}</Text>
      <Text style={styles.userIssue}>Issue: {item.issue}</Text>
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Add Member</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Member</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name, skill, project, or issue..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
      />
      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderUser}
        contentContainerStyle={styles.resultsList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1f1f2e",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: "#2e2e3e",
    color: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#3e3e4e",
  },
  resultsList: {
    paddingBottom: 20,
  },
  userCard: {
    backgroundColor: "#2e2e3e",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  userSkill: {
    fontSize: 14,
    color: "#b0b0b0",
  },
  userProject: {
    fontSize: 14,
    color: "#b0b0b0",
  },
  userIssue: {
    fontSize: 14,
    color: "#b0b0b0",
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#4e4e6e",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
