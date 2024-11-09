// App.js
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from './contexts/auth'; // Adjust the path if necessary

import DashboardScreen from './screens/DashboardScreen';
import InitProject from './screens/InitProject';
import RegisterScreen from './screens/RegisterScreen';
import SettingsScreen from './screens/SettingsScreen'; // Example screen
import SignInScreen from './screens/SigninScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import ProjectDetailScreen from './screens/ProjectDetail'; // Import ProjectDetailScreen


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AppTabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarStyle: {
        position: 'absolute', // Makes the tab bar absolutely positioned
        bottom: 10, // Distance from the bottom of the screen
        left: 10, // Distance from the left side of the screen
        right: 10, // Distance from the right side of the screen
        backgroundColor: '#000000', // Background color of the tab bar
        borderRadius: 15, // Rounded corners for a modern look
        height: 60, // Height of the tab bar
      },
      tabBarActiveTintColor: '#0000ff', // Color for active tab
      tabBarInactiveTintColor: 'gray',
      headerShown: false // Color for inactive tab
    }}
  >
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Profile" component={UserProfileScreen} />
    <Tab.Screen name="Settings" component={SettingsScreen} />
    <Tab.Screen
      name="InitProject"
      component={InitProject}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="add-circle-outline" color={color} size={size} />
        ),
        tabBarLabel: "New Project", // Label for the Plus button
      }}
    />
  </Tab.Navigator>
);

// AuthStack: Screens for authentication
const AuthStack = () => (
  <Stack.Navigator initialRouteName="Register">
    <Stack.Screen name="SignIn" component={SignInScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// AppStack: Main app screens for authenticated users
const AppStack = () => (
  <Stack.Navigator
    initialRouteName="AppTabs"
    screenOptions={{ headerShown: false }} // Hide header for all AppStack screens
  >
    <Stack.Screen name="AppTabs" component={AppTabs} />
    <Stack.Screen
      name="ProjectDetail"
      component={ProjectDetailScreen}
      options={{ headerShown: true, title: "Project Details" }}
    />
    {/* Add more stack screens if needed */}
  </Stack.Navigator>
);

// Main navigator to switch between AuthStack and AppStack
const MainNavigator = () => {
  const { authData, loading } = useAuth();

  // Show a loading spinner while checking authentication status
  if (loading) {
    return (
      <View
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return authData ? <AppStack /> : <AuthStack />;
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
