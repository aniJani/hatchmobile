import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function GoalScreen() {
  const [taskName, setTaskName] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [tasks, setTasks] = useState([]);

  const addTask = () => {
    if (taskName.trim() && assignedTo.trim()) {
      setTasks([...tasks, { id: Date.now().toString(), taskName, assignedTo }]);
      setTaskName("");
      setAssignedTo("");
    } else {
      alert("Please enter both task name and assignee's name.");
    }
  };

  const renderTask = ({ item }) => (
    <View style={styles.taskContainer}>
      <Text style={styles.taskText}>{item.taskName}</Text>
      <Text style={styles.assigneeText}>Assigned to: {item.assignedTo}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task Division</Text>

      <TextInput
        style={styles.input}
        placeholder="Task Name"
        value={taskName}
        onChangeText={setTaskName}
      />
      <TextInput
        style={styles.input}
        placeholder="Assigned To (Member Name)"
        value={assignedTo}
        onChangeText={setAssignedTo}
      />

      <Button title="Add Task" onPress={addTask} />

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        style={styles.taskList}
      />
      <Button
        title="Go to Dashboard"
        onPress={() => navigation.navigate("Dashboard")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10,
  },
  taskList: {
    marginTop: 20,
  },
  taskContainer: {
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginVertical: 5,
  },
  taskText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  assigneeText: {
    fontSize: 16,
    color: "#555",
  },
});
