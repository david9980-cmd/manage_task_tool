// src/api.ts
import axios from 'axios';
import { ITaskItem } from '../types';

// Base URL for the API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Set up axios default configuration
axios.defaults.baseURL = API_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';

// Helper function to set Authorization header
export const setAuthToken = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Authentication API requests
export const loginApi = async (email: string, password: string) => {
  const response = await axios.post('/auth/login', { email, password });
  return response.data;
};

export const registerApi = async (
  email: string,
  password: string
) => {
  const response = await axios.post('/auth/register', { email, password });
  return response.data;
};

// Fetch tasks from the API
export const fetchTasksApi = async () => {
  try {
    const response = await axios.get('/tasks');
    return response.data; // Assuming the API returns tasks as an array
  } catch (error: any) {
    throw error;
  }
};

// Add a new task to the API
export const addTaskApi = async (task: ITaskItem) => {
  try {
    const response = await axios.post('/tasks', task);
    return response.data; // Assuming the API returns the created task object
  } catch (error: any) {
    throw error;
  }
};

// Update an existing task in the API
export const updateTaskApi = async (task: ITaskItem) => {
  try {
    const response = await axios.put(`/tasks/${task.id}`, task);
    return response.data; // Assuming the API returns the updated task object
  } catch (error: any) {
    throw error;
  }
};

// Delete a task from the API
export const deleteTaskApi = async (taskId: string) => {
  try {
    await axios.delete(`/tasks/${taskId}`);
  } catch (error: any) {
    throw error;
  }
};

// Fetch all users
export const fetchEmployeesApi = async () => {
  try {
    const response = await axios.get('/auth/employees');
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
