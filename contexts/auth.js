// auth.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase"; // Adjust the path if necessary

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load auth data from AsyncStorage
    const loadStorageData = async () => {
      try {
        const authDataSerialized = await AsyncStorage.getItem("@AuthData");
        if (authDataSerialized) {
          setAuthData(JSON.parse(authDataSerialized));
        }
      } catch (error) {
        console.error("Failed to load auth data from storage:", error);
      }
    };

    // Set up auth state listener
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userData = {
          token: user.uid,
          email: user.email,
          name: user.displayName,
        };
        setAuthData(userData);
        await AsyncStorage.setItem("@AuthData", JSON.stringify(userData));
      } else {
        setAuthData(null);
        await AsyncStorage.removeItem("@AuthData");
      }
      setLoading(false);
    });

    loadStorageData();

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await auth.signOut();
      setAuthData(null);
      await AsyncStorage.removeItem("@AuthData");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authData,
        loading,
        setAuthData,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
