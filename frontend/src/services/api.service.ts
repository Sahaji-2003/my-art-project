// src/services/api.service.ts

import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const BASE_URL = 'http://localhost:3001/api/v1';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('arthub_token');
    if (token) {
      if (!config.headers) config.headers = new axios.AxiosHeaders();
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('arthub_token');
      localStorage.removeItem('arthub_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Type definitions
export interface User {
  _id: string;
  name: string;
  email: string;
  isArtist: boolean;
  profilePicture?: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  message?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ArtistProfileData {
  bio?: string;
  portfolio?: string;
  socialMediaLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    website?: string;
  };
  profilePicture?: string;
}

export interface ArtworkData {
  title: string;
  description: string;
  price: number;
  images: Array<{ url: string; isPrimary: boolean }>;
  medium: string;
  style: string;
  dimensions?: {
    width?: number;
    height?: number;
    depth?: number;
    unit?: string;
  };
  tags?: string[];
}

export interface OrderData {
  shipping_address: string;
  payment_method: string;
}

export interface ReviewData {
  orderId: string;
  rating: number;
  comment?: string;
}

export interface ConnectionData {
  user_id: string;
  connectionType?: string;
  message?: string;
}

// Auth API
export const authAPI = {
  signup: async (data: SignupData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/signup', data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await apiClient.put('/auth/profile', data);
    return response.data;
  },
};

// Artist API
export const artistAPI = {
  createProfile: async (data: ArtistProfileData): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/artists/profile', data);
    return response.data;
  },

  getProfile: async (userId?: string): Promise<ApiResponse<any>> => {
    const url = userId ? `/artists/profile/${userId}` : '/artists/profile';
    const response = await apiClient.get(url);
    return response.data;
  },

  updateProfile: async (data: ArtistProfileData): Promise<ApiResponse<any>> => {
    const response = await apiClient.put('/artists/profile', data);
    return response.data;
  },

  getAllArtists: async (page = 1, limit = 10): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get(`/artists?page=${page}&limit=${limit}`);
    return response.data;
  },

  getInventory: async (): Promise<ApiResponse<{ artworks: any[] }>> => {
    const response = await apiClient.get('/artists/inventory');
    return response.data;
  },

  getStats: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/artists/stats');
    return response.data;
  },
};

// Artwork API
export const artworkAPI = {
  createArtwork: async (data: ArtworkData): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/artworks', data);
    return response.data;
  },

  getArtwork: async (artworkId: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.get(`/artworks/${artworkId}`);
    return response.data;
  },

  updateArtwork: async (artworkId: string, data: Partial<ArtworkData>): Promise<ApiResponse<any>> => {
    const response = await apiClient.put(`/artworks/${artworkId}`, data);
    return response.data;
  },

  deleteArtwork: async (artworkId: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.delete(`/artworks/${artworkId}`);
    return response.data;
  },

  searchArtwork: async (params: {
    q?: string;
    medium?: string;
    style?: string;
    price_min?: number;
    price_max?: number;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<any[]>> => {
    const queryString = new URLSearchParams(
      Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== '')
        .map(([key, value]) => [key, String(value)])
    ).toString();
    const response = await apiClient.get(`/artworks/search?${queryString}`);
    return response.data;
  },

  toggleLike: async (artworkId: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.post(`/artworks/${artworkId}/like`);
    return response.data;
  },

  uploadImage: async (file: File): Promise<ApiResponse<{ url: string }>> => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await apiClient.post('/artworks/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Order API
export const orderAPI = {
  createOrder: async (artworkId: string, data: OrderData): Promise<ApiResponse<any>> => {
    const response = await apiClient.post(`/orders/${artworkId}/purchase`, data);
    return response.data;
  },

  getOrder: async (orderId: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data;
  },

  getUserOrders: async (): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get('/orders/my-orders');
    return response.data;
  },

  getArtistOrders: async (): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get('/orders/artist-orders');
    return response.data;
  },

  updateOrderStatus: async (orderId: string, status: string, trackingNumber?: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.put(`/orders/${orderId}/status`, { status, trackingNumber });
    return response.data;
  },
};

// Review API
export const reviewAPI = {
  createReview: async (data: ReviewData): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/reviews', data);
    return response.data;
  },

  getArtworkReviews: async (artworkId: string): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get(`/reviews/artwork/${artworkId}`);
    return response.data;
  },

  updateReview: async (reviewId: string, data: Partial<ReviewData>): Promise<ApiResponse<any>> => {
    const response = await apiClient.put(`/reviews/${reviewId}`, data);
    return response.data;
  },

  deleteReview: async (reviewId: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.delete(`/reviews/${reviewId}`);
    return response.data;
  },
};

// Community API
export const communityAPI = {
  sendConnectionRequest: async (data: ConnectionData): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/community', data);
    return response.data;
  },

  getConnectionRequests: async (): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get('/community/requests');
    return response.data;
  },

  getConnections: async (): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get('/community/connections');
    return response.data;
  },

  updateConnectionStatus: async (connectionId: string, status: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.put(`/community/${connectionId}`, { status });
    return response.data;
  },

  deleteConnection: async (connectionId: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.delete(`/community/${connectionId}`);
    return response.data;
  },
};

// Auth Helper Functions
export const setAuthToken = (token: string) => {
  localStorage.setItem('arthub_token', token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('arthub_token');
};

export const removeAuthToken = () => {
  localStorage.removeItem('arthub_token');
  localStorage.removeItem('arthub_user');
};

export const setUser = (user: User) => {
  localStorage.setItem('arthub_user', JSON.stringify(user));
};

export const getUser = (): User | null => {
  const userStr = localStorage.getItem('arthub_user');
  return userStr ? JSON.parse(userStr) : null;
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

export default apiClient;