import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import RegisterScreen from "./screens/RegisterScreen";
import SignInScreen from "./screens/SigninScreen";
import DashboardScreen from "./screens/DashboardScreen";
import MatchmakingScreen from "./screens/MatchmakingScreen";
import GoalScreen from "./screens/GoalScreen";

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export function AppStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Dashboard">
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="MatchmakingScreen" component={MatchmakingScreen} />
        <Stack.Screen name="GoalScreen" component={GoalScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export function App() {
  const [isSignedIn, setIsSignedIn] = useState(false); // Track sign-in state

  return <NavigationContainer></NavigationContainer>;
}
