// ============================================
// src/services/login.ts
// ============================================

import axios from 'axios';
import type { AxiosResponse, AxiosError } from 'axios';

const BASE_URL = 'http://localhost:3001/api/v1';

// Create axios instance for login service
const loginClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Type definitions
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: {
      _id: string;
      name: string;
      email: string;
      isArtist: boolean;
      profilePicture?: string;
      createdAt: string;
    };
    token: string;
  };
  message?: string;
}

export interface AuthError {
  success: false;
  error: string;
  details?: {
    field?: string;
    message?: string;
  };
}

// Login API functions
export const loginAPI = {
  /**
   * Authenticate user with email and password
   * @param credentials - User login credentials
   * @returns Promise with login response
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response: AxiosResponse<AuthResponse> = await loginClient.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<AuthError>;
      
      if (axiosError.response) {
        // Server responded with error status
        throw new Error(axiosError.response.data?.error || 'Login failed');
      } else if (axiosError.request) {
        // Request was made but no response received
        throw new Error('Network error. Please check your connection.');
      } else {
        // Something else happened
        throw new Error('An unexpected error occurred');
      }
    }
  },

  /**
   * Register new user with name, email and password
   * @param credentials - User signup credentials
   * @returns Promise with signup response
   */
  signup: async (credentials: SignupCredentials): Promise<AuthResponse> => {
    try {
      const response: AxiosResponse<AuthResponse> = await loginClient.post('/auth/signup', credentials);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<AuthError>;
      
      if (axiosError.response) {
        // Server responded with error status
        throw new Error(axiosError.response.data?.error || 'Signup failed');
      } else if (axiosError.request) {
        // Request was made but no response received
        throw new Error('Network error. Please check your connection.');
      } else {
        // Something else happened
        throw new Error('An unexpected error occurred');
      }
    }
  },

  /**
   * Validate email format
   * @param email - Email to validate
   * @returns boolean indicating if email is valid
   */
  validateEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate password strength
   * @param password - Password to validate
   * @returns object with validation result and message
   */
  validatePassword: (password: string): { isValid: boolean; message: string } => {
    if (password.length < 8) {
      return {
        isValid: false,
        message: 'Password must be at least 8 characters long'
      };
    }
    
    if (password.length > 128) {
      return {
        isValid: false,
        message: 'Password must be less than 128 characters'
      };
    }

    return {
      isValid: true,
      message: ''
    };
  },

  /**
   * Check if user is already logged in
   * @returns boolean indicating if user is authenticated
   */
  isLoggedIn: (): boolean => {
    const token = localStorage.getItem('arthub_token');
    const user = localStorage.getItem('arthub_user');
    return !!(token && user);
  },

  /**
   * Get current user from localStorage
   * @returns User object or null
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem('arthub_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Save authentication data to localStorage
   * @param token - JWT token
   * @param user - User object
   */
  saveAuthData: (token: string, user: any) => {
    localStorage.setItem('arthub_token', token);
    localStorage.setItem('arthub_user', JSON.stringify(user));
  },

  /**
   * Clear authentication data from localStorage
   */
  clearAuthData: () => {
    localStorage.removeItem('arthub_token');
    localStorage.removeItem('arthub_user');
  },

  /**
   * Logout user
   */
  logout: () => {
    loginAPI.clearAuthData();
    window.location.href = '/login';
  }
};

// Form validation helpers
export const formValidation = {
  /**
   * Validate login form
   * @param email - Email input
   * @param password - Password input
   * @returns object with validation results
   */
  validateLoginForm: (email: string, password: string) => {
    const errors: { email?: string; password?: string; general?: string } = {};

    // Email validation
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!loginAPI.validateEmail(email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!password.trim()) {
      errors.password = 'Password is required';
    } else {
      const passwordValidation = loginAPI.validatePassword(password);
      if (!passwordValidation.isValid) {
        errors.password = passwordValidation.message;
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  /**
   * Validate signup form
   * @param name - Name input
   * @param email - Email input
   * @param password - Password input
   * @returns object with validation results
   */
  validateSignupForm: (name: string, email: string, password: string) => {
    const errors: { name?: string; email?: string; password?: string; general?: string } = {};

    // Name validation
    if (!name.trim()) {
      errors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    } else if (name.trim().length > 50) {
      errors.name = 'Name must be less than 50 characters';
    }

    // Email validation
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!loginAPI.validateEmail(email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!password.trim()) {
      errors.password = 'Password is required';
    } else {
      const passwordValidation = loginAPI.validatePassword(password);
      if (!passwordValidation.isValid) {
        errors.password = passwordValidation.message;
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};

export default loginAPI;
