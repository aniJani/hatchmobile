import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { signInUser } from "../services/userServices";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { auth } from "../firebase"; // Import your Firebase auth configuration

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    try {
      const data = await signInUser(email, password); // Call the signInUser service

      Alert.alert("Success", "Sign in successful!");
      navigation.navigate("Dashboard"); // Navigate to Dashboard on successful sign-in
    } catch (error) {
      console.error(error);
      Alert.alert("Error", error.message || "Something went wrong during sign-in.");
    }
  };
  
  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address first.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email); // Firebase method to send a password reset email
      Alert.alert("Success", "Password reset email sent! Please check your inbox.");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", error.message || "Failed to send password reset email.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Sign In" onPress={handleSignIn} />

      <Button title="Forgot Password?" onPress={handleForgotPassword} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10,
  },
});
