// App.js
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from './contexts/auth'; // Adjust the path if necessary
import DashboardScreen from './screens/DashboardScreen';
import RegisterScreen from './screens/RegisterScreen';
import SignInScreen from './screens/SignInScreen';

const Stack = createStackNavigator();

// AuthStack: Screens for authentication
const AuthStack = () => (
  <Stack.Navigator initialRouteName="Register">
    <Stack.Screen name="SignIn" component={SignInScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// AppStack: Main app screens for authenticated users
const AppStack = () => (
  <Stack.Navigator initialRouteName="Dashboard">
    <Stack.Screen name="Dashboard" component={DashboardScreen} />
    {/* Add more screens here as needed */}
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
