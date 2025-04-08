// services/chatService.js
import axios from "axios";

// Fetch messages for a project
export const getMessages = async (projectId) => {
  try {
    const response = await axios.get(`/api/chat/${projectId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

// Send a new message
export const sendMessage = async (projectId, senderId, message) => {
  try {
    const response = await axios.post(`/api/chat/${projectId}`, {
      senderId,
      message,
    });
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};
