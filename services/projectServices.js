// services/projectService.js
import axios from 'axios';

// Ensure you correctly format the URL using template literals
export const loadProjects = async () => {
  try {
    const response = await axios.get(`http://${process.env.BASE_URL}/project/list`);
    return response.data;
  } catch (error) {
    console.error("Error loading projects:", error);
    throw error;
  }
};

export const loadTasks = async () => {
  try {
    const response = await axios.get(`http://${process.env.BASE_URL}/task/list`);
    return response.data;
  } catch (error) {
    console.error("Error loading tasks:", error);
    throw error;
  }
};
