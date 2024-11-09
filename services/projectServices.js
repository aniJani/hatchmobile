// services/projectService.js
import axios from 'axios';

// Ensure you correctly format the URL using template literals
// Function to load projects by user email
export const loadProjects = async (email) => {
    try {
      // Construct the base URL using an environment variable and template literals
        const response = await axios.get(`http://${process.env.BASE_URL}/projects/list`, {
        params: { email }, // Pass the email as a query parameter
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      return response.data.projects; // Return the list of projects
    } catch (error) {
      console.error("Error loading projects:", error);
      throw error; // Re-throw the error for further handling if needed
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
export const getProjectById = async (projectId) => {
  try {
    const response = await axios.get(`http://${process.env.BASE_URL}/projects/${projectId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching project details:", error);
    throw error;
  }
};