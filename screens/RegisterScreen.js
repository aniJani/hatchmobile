// RegisterScreen.js
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'; // Import methods from firebase/auth
import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../contexts/auth'; // Adjust the path if necessary
import { auth } from '../firebase'; // Import auth from firebase.js

const API_URL = 'http://10.0.0.184:3000/user/register'; // Replace with your backend URL

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('');
  const [openToCollaboration, setOpenToCollaboration] = useState(true);
  const [error, setError] = useState('');

  const { setAuthData } = useAuth();

  const handleRegister = async () => {
    setError(''); // Clear previous errors

    // Validation checks
    if (!name) {
      setError('Please enter your name.');
      return;
    }
    if (!email) {
      setError('Please enter an email address.');
      return;
    }
    if (!password) {
      setError('Please enter a password.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      // Register with Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Update the user profile with display name
      await updateProfile(user, { displayName: name });

      // Prepare data for MongoDB
      const userData = {
        email,
        name,
        description,
        skills: skills.split(',').map((skill) => skill.trim()), // Convert comma-separated skills to array
        openToCollaboration,
      };

      // Send data to backend
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        Alert.alert('Success', 'Account created successfully!');
        setAuthData({
          token: user.uid,
          email: user.email,
          name: user.displayName,
        });
        navigation.navigate('Dashboard'); // Replace with your desired screen
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to register user in database.');
      }
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/email-already-in-use') {
        setError('Email is already in use.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else if (error.code === 'auth/weak-password') {
        setError('Password is too weak.');
      } else {
        setError('Failed to sign up. Please try again.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
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
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Skills (comma-separated)"
        value={skills}
        onChangeText={setSkills}
      />
      <View style={styles.switchContainer}>
        <Text>Open to Collaboration</Text>
        <Switch
          value={openToCollaboration}
          onValueChange={setOpenToCollaboration}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
        <Text style={styles.signInLink}>
          Already have an account? Sign In
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  signInLink: {
    marginTop: 20,
    textAlign: 'center',
    color: '#007BFF',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default RegisterScreen;
