import axios from "axios";

// Function to register a new user
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`/users/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Function to login a user
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`/users/login`, credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const verifyUserEmail = async (token) => {
  try {
    const response = await axios.get(`/users/verify-email/${token}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
