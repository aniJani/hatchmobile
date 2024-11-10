import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Configure notification settings
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Function to request permission and get Expo push token
export async function registerForPushNotificationsAsync() {
  let token;

  // Request permissions for iOS
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    alert("Failed to get push token for notifications!");
    return;
  }

  // Get the Expo push token
  token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log("Expo Push Token:", token);

  // Android-specific notification channel setup
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}
