// services/projectService.js
import axios from 'axios';

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
