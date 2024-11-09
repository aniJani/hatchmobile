import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { signInUser } from "../services/userServices";
import {
  Alert,
  TouchableOpacity,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
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
      Alert.alert(
        "Error",
        error.message || "Something went wrong during sign-in."
      );
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address first.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email); // Firebase method to send a password reset email
      Alert.alert(
        "Success",
        "Password reset email sent! Please check your inbox."
      );
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Error",
        error.message || "Failed to send password reset email."
      );
    }
  };

  return (
    <LinearGradient
      colors={["#000000", "#272640"]} // Black to purple gradient
      style={styles.gradient}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Sign In</Text>

        <TextInput
          style={styles.input}
          placeholderTextColor="#8d99ae"
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#8d99ae"
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.forgotButton}
            onPress={handleForgotPassword}
          >
            <Text style={styles.forgotButtonText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#1a1a2e",
  },
  title: {
    fontSize: 24,
    color: "#dee2e6",
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#2e2e3e",
    color: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  signInButton: {
    backgroundColor: "#495057",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginLeft: 10,
  },
  buttonText: {
    color: "#dee2e6",
    fontSize: 18,
    fontWeight: "bold",
  },
  forgotButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
  },
  forgotButtonText: {
    color: "#b0b0b0",
    fontSize: 14,
  },
});
