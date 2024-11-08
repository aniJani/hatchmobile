import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

export default function NotificationsScreen() {
  // Sample notifications data
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "Welcome to the App!",
      message: "Thank you for signing up. Enjoy your experience!",
      timestamp: "2024-11-07 10:30 AM",
    },
    {
      id: "2",
      title: "New Feature Update",
      message: "Check out the new features we've added just for you.",
      timestamp: "2024-11-06 5:45 PM",
    },
    {
      id: "3",
      title: "Reminder",
      message: "Don't forget to complete your profile for a better experience.",
      timestamp: "2024-11-05 2:00 PM",
    },
  ]);

  useEffect(() => {
    // Uncomment and replace with real API call
    // const fetchNotifications = async () => {
    //   try {
    //     const response = await axios.get('https://your-api-url.com/notifications');
    //     setNotifications(response.data);
    //   } catch (error) {
    //     console.error("Error fetching notifications:", error);
    //   }
    // };
    // fetchNotifications();
  }, []);

  // Render each notification item
  const renderNotification = ({ item }) => (
    <View style={styles.notificationCard}>
      <Text style={styles.notificationTitle}>{item.title}</Text>
      <Text style={styles.notificationMessage}>{item.message}</Text>
      <Text style={styles.notificationTimestamp}>{item.timestamp}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1f1f2e",
    paddingTop: 20,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  notificationCard: {
    backgroundColor: "#2e2e3e",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  notificationMessage: {
    fontSize: 14,
    color: "#c0c0c0",
    marginBottom: 10,
  },
  notificationTimestamp: {
    fontSize: 12,
    color: "#808080",
    textAlign: "right",
  },
});
