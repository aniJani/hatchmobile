import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { signInUser } from "../services/userServices";
import { Alert, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Platform } from "react-native";
import { auth } from "../firebase"; // Import your Firebase auth configuration
import { MaterialIcons } from "@expo/vector-icons";

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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Text style={styles.title}>Sign In</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity onPress={handleSignIn} style={[styles.button, styles.signInButton]}>
          <MaterialIcons name="login" size={24} color="#fff" />
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPasswordButton}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.registerText}>Don't have an account? Register</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    paddingTop: 45,
  },
  scrollViewContainer: {
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#fff",
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#444",
    padding: 10,
    marginVertical: 10,
    color: "#fff",
    backgroundColor: "#333",
    borderRadius: 8,
  },
  button: {
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  signInButton: {
    backgroundColor: "#2196F3",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 5,
  },
  forgotPasswordButton: {
    alignItems: "center",
    marginTop: 10,
  },
  forgotPasswordText: {
    color: "#2196F3",
    fontSize: 16,
  },
  registerText: {
    textAlign: "center",
    marginTop: 20,
    color: "#2196F3",
    fontSize: 16,
  },
});
