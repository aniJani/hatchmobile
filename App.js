// App.js
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from './contexts/auth'; // Adjust the path if necessary
import ColabProfilePage from './screens/ColabProfilePage';
import DashboardScreen from './screens/DashboardScreen';
import InitProject from './screens/InitProject';
import InvitesScreen from './screens/InvitesScreen';
import MatchmakingScreen from './screens/MatchmakingScreen';
import ProjectDetailScreen from './screens/ProjectDetail'; // Import ProjectDetailScreen
import RegisterScreen from './screens/RegisterScreen';
import SignInScreen from './screens/SigninScreen';
import UserProfileScreen from './screens/UserProfileScreen';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AppTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;

        // Determine the icon based on the route name
        if (route.name === 'Dashboard') {
          iconName = 'home-outline';
        } else if (route.name === 'Profile') {
          iconName = 'person-outline';
        } else if (route.name === 'New Project') {
          iconName = 'add-circle-outline';
        }

        // Return the Ionicons component with the appropriate icon
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarStyle: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        right: 10,
        backgroundColor: "rgba(255, 255, 255, 0.05)", // Blue background
        borderRadius: 30,
        height: 60,
        margin: 10,
        padding: 10,
        justifyContent: 'center', // Center items vertically
        alignItems: 'center',
      },
      tabBarActiveTintColor: '#ffffff', // White color for active icon
      tabBarInactiveTintColor: 'gray',
      //tabBarShowLabel: false, // Hide tab labels
      headerShown: false,
    })}
  >
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Profile" component={UserProfileScreen} />
    <Tab.Screen name="New Project" component={InitProject} />
  </Tab.Navigator>
);


// AuthStack: Screens for authentication
const AuthStack = () => (
  <Stack.Navigator initialRouteName="Register" screenOptions={{ headerShown: false }}>
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
      options={{ headerShown: false, title: "Project Details" }}
    />
    <Stack.Screen
      name="InvitesScreen"
      component={InvitesScreen}
    />
    <Stack.Screen
      name="MatchmakingScreen"
      component={MatchmakingScreen}
      options={{ headerShown: false, title: "Matchmaking Screen" }}
    />
    <Stack.Screen
      name="ColabProfilePage"
      component={ColabProfilePage}
    />
    <Stack.Screen name="Dashboard" component={DashboardScreen} />
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
