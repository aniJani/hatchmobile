// services/userServices.js
import axios from "axios";
import * as Notifications from "expo-notifications";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';

export const registerUser = async ({ name, email, password, description, skills, openToCollaboration }) => {
  try {
    // Register with Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update the user profile with the display name
    await updateProfile(user, { displayName: name });

    // Get the Expo Push Token
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      await Notifications.requestPermissionsAsync();
    }
    const expoPushToken = (await Notifications.getExpoPushTokenAsync()).data;

    // Prepare data for MongoDB
    const userData = {
      email,
      name,
      description,
      skills: skills.split(',').map((skill) => skill.trim()), // Convert comma-separated skills to array
      openToCollaboration,
      expoPushToken, // Include the Expo Push Token
    };

    // Send data to the backend
    const response = await fetch(`http://${process.env.BASE_URL}/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to register user in the database.');
    }

    return { user };
  } catch (error) {
    throw error;
  }
};

export const signInUser = async (email, password) => {
  try {
    // Use Firebase Authentication to sign in the user
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user; // Get user info
    return { user };
  } catch (error) {
    // Handle errors appropriately
    if (error.code === 'auth/user-not-found') {
      throw new Error('User not found. Please check your email.');
    } else if (error.code === 'auth/wrong-password') {
      throw new Error('Incorrect password. Please try again.');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email address.');
    } else {
      throw new Error('Failed to sign in. Please try again later.');
    }
  }
};

export const getUserByEmail = async (email) => {
  try {
    // Validate that the email is provided
    if (!email) {
      throw new Error('Email is required');
    }

    // Make a GET request to the backend endpoint to fetch the user by email
    const response = await axios.get(`http://${process.env.BASE_URL}/user/getUserByEmail`, {
      params: { email },
    });

    // Return the user data from the response
    return response.data;
  } catch (error) {
    // Handle errors and rethrow them with a descriptive message
    if (error.response && error.response.status === 404) {
      throw new Error('User not found');
    } else if (error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch user data');
    } else {
      throw new Error('Network error. Please try again later.');
    }
  }
};


/**
 * Function to update user details in MongoDB
 * @param {string} email - The user's email.
 * @param {Object} updateData - The field and value to update (e.g., { skills: ["React", "Node.js"] }).
 * @returns {Promise<object>} - The API response after updating the user.
 */
export const updateUser = async (email, updateData) => {
  try {
    const response = await axios.put(`http://${process.env.BASE_URL}/user/update`, {
      email,
      ...updateData
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};
