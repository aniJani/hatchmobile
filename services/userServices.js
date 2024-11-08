// services/userServices.js
import axios from "axios";
import { createUserWithEmailAndPassword, updateProfile,signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export const registerUser = async ({ name, email, password, description, skills, openToCollaboration }) => {
  try {
    // Register with Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
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
    const response = await fetch(`http://${process.env.BASE_URL}/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to register user in database.');
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
