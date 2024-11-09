// RegisterScreen.js
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"; // Import methods from firebase/auth
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../contexts/auth"; // Adjust the path if necessary
import { registerUser } from "../services/userServices";
import { LinearGradient } from "expo-linear-gradient";

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [openToCollaboration, setOpenToCollaboration] = useState(true);
  const [error, setError] = useState("");

  const { setAuthData } = useAuth();

  const handleRegister = async () => {
    setError(""); // Clear previous errors

    // Validation checks
    if (!name) {
      setError("Please enter your name.");
      return;
    }
    if (!email) {
      setError("Please enter an email address.");
      return;
    }
    if (!password) {
      setError("Please enter a password.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Call the registerUser service
      const { user } = await registerUser({
        name,
        email,
        password,
        description,
        skills,
        openToCollaboration,
      });

      Alert.alert("Success", "Account created successfully!");
      setAuthData({
        token: user.uid,
        email: user.email,
        name: user.displayName,
      });
      navigation.navigate("Dashboard"); // Replace with your desired screen
    } catch (error) {
      console.error(error);
      if (error.code === "auth/email-already-in-use") {
        setError("Email is already in use.");
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email address.");
      } else if (error.code === "auth/weak-password") {
        setError("Password is too weak.");
      } else {
        setError(error.message || "Failed to sign up. Please try again.");
      }
    }
  };

  return (
    <LinearGradient colors={["#001427", "#001845"]} style={styles.gradient}>
      <View style={styles.container}>
        <Text style={styles.title}>Create Account</Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#8d99ae"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#8d99ae"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#8d99ae"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#8d99ae"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          placeholderTextColor="#8d99ae"
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={styles.input}
          placeholder="Skills (comma-separated)"
          placeholderTextColor="#8d99ae"
          value={skills}
          onChangeText={setSkills}
        />
        <View style={styles.switchContainer}>
          <Text style={styles.switchText}>Open to Collaboration</Text>
          <Switch
            value={openToCollaboration}
            onValueChange={setOpenToCollaboration}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
            <Text style={styles.signInLink}>
              Already have an account? Sign In
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

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
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
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
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  switchText: {
    color: "#dee2e6",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#495057",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#dee2e6",
    fontSize: 18,
    fontWeight: "bold",
  },
  signInLink: {
    marginTop: 20,
    textAlign: "center",
    color: "#b0b0b0",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
});

export default RegisterScreen;
