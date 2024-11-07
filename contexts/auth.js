import AsyncStorage from "@react-native-async-storage/async-storage";
import auth from "@react-native-firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      if (user) {
        const userData = {
          token: user.uid,
          email: user.email,
          name: user.displayName,
        };
        setAuthData(userData);
        await AsyncStorage.setItem("@AuthData", JSON.stringify(userData)); // Store authData
        await AsyncStorage.setItem("@UserEmail", user.email); // Store email separately
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loadStorageData = async () => {
    try {
      const authDataSerialized = await AsyncStorage.getItem("@AuthData");
      if (authDataSerialized) {
        setAuthData(JSON.parse(authDataSerialized));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await auth().signOut();
      setAuthData(null);
      await AsyncStorage.removeItem("@AuthData");
      await AsyncStorage.removeItem("@UserEmail"); // Remove email
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const updateDisplayName = async (newDisplayName) => {
    try {
      const user = auth().currentUser;
      if (user) {
        await user.updateProfile({
          displayName: newDisplayName,
        });
        const updatedUserData = {
          token: user.uid,
          email: user.email,
          name: newDisplayName,
        };
        setAuthData(updatedUserData);
        await AsyncStorage.setItem(
          "@AuthData",
          JSON.stringify(updatedUserData)
        );
      }
    } catch (error) {
      console.error("Error updating display name: ", error);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const user = auth().currentUser;
      const cred = auth.EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await user.reauthenticateWithCredential(cred);
      await user.updatePassword(newPassword);
    } catch (error) {
      throw new Error("Error changing password: " + error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authData,
        loading,
        setAuthData,
        updateDisplayName,
        changePassword,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
