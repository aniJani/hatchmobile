import { BASE_URL } from '@env';
import axios from 'axios';

/**
 * Sends a task description to the /openai/TaskGen endpoint and returns the response.
 *
 * @param {string} taskDescription - A description of the task for generating task division steps.
 * @returns {Promise<object>} - The API response containing task division details.
 */
export const createTaskDivision = async (taskDescription) => {
    try {
        const response = await axios.post(`${BASE_URL}/openai/TaskGen`, {
            task: taskDescription,
        });
        return response.data; // Returns the data from the API response
    } catch (error) {
        console.error('Error creating task division:', error);
        throw error;
    }
};
