
import axios from 'axios';

/**
 * Sends a task description to the /openai/TaskGen endpoint and returns the response.
 *
 * @param {string} taskDescription - A description of the task for generating task division steps.
 * @returns {Promise<object>} - The API response containing task division details.
 */
export const createTaskDivision = async (taskDescription) => {
    try {
        const response = await axios.post(`http://${process.env.BASE_URL}/openai/TaskGen`, {
            task: taskDescription,
        });
        return response.data; // Returns the data from the API response
    } catch (error) {
        console.error('Error creating task division:', error);
        throw error;
    }
};

export const saveTasksToDatabase = async (tasks) => {
  try {
    // Simulate a delay to mimic an API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Log the tasks to the console to simulate saving
    console.log("Tasks saved successfully:", tasks);

    // Return a success message
    return { message: "Tasks saved successfully (dummy response)" };
  } catch (error) {
    console.error("Error saving tasks to the database:", error);
    throw error; // Re-throw the error for the caller to handle
  }
};
