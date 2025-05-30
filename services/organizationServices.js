// services/organizationServices.js

import axios from "axios";
import { BASE_URL } from "@env";
export const createOrganization = async (email, name) => {
  try {
    const response = await axios.post(
      `http://${process.env.BASE_URL}/organizations`,
      {
        name,
        email,
      }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const getUserOrganizations = async (email) => {
  try {
    const response = await axios.get(
      `http://${process.env.BASE_URL}/organizations/user`,
      {
        params: { email },
      }
    );
    return response.data.organizations;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const joinOrganization = async (email, inviteCode) => {
  try {
    const response = await axios.post(
      `http://${process.env.BASE_URL}/organizations`,
      {
        inviteCode,
        email,
      }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const getOrganizationById = async (organizationId) => {
  try {
    const response = await axios.get(
      `http://${process.env.BASE_URL}/organizations/${organizationId}`
    );
    return response.data.organization;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};
