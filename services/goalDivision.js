import axios from "axios";
//${process.env.BASE_URL}
/**
 * Sends a task description to the /openai/TaskGen endpoint and returns the response.
 *
 * @param {string} taskDescription - A description of the task for generating task division steps.
 * @returns {Promise<object>} - The API response containing task division details.
 */
export const createTaskDivision = async (taskDescription) => {
  try {
    const response = await axios.post(
      `http://${process.env.BASE_URL}/openai/TaskGen`,
      {
        task: taskDescription,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating task division:", error);
    throw error;
  }
};

/**
 * Saves the entire project, including name, description, owner, collaborators, and tasks, to the backend.
 *
 * @param {string} projectName - The name of the project.
 * @param {string} projectDescription - A description of the project.
 * @param {string} ownerEmail - The email of the project owner.
 * @param {Array} tasks - The tasks to be included in the project.
 * @returns {Promise<object>} - The API response confirming the project was saved.
 */
export const saveTasksToDatabase = async (
  projectName,
  projectDescription,
  ownerEmail,
  tasks
) => {
  const projectData = {
    projectName,
    description: projectDescription,
    ownerEmail,
    collaborators: [{ email: ownerEmail, role: "owner" }], // Add owner as the first collaborator
    goals: tasks.map((task) => ({
      title: task.stepTitle,
      description: task.description,
      status: "not started",
      assignedTo: task.assignedTo || ownerEmail, // Assign to the owner if not specified
      estimatedTime: task.estimatedTime || "", // Include estimated time if available
    })),
  };

  try {
    const response = await axios.post(
      `http://${process.env.BASE_URL}/projects/create`,
      projectData
    );
    console.log("Project and tasks saved successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error saving project and tasks:", error);
    throw error;
  }
};
