// ============================================
// src/services/artist.ts
// ============================================
import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api/v1';

// Create axios instance for artist API
const artistClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
artistClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('arthub_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
artistClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('arthub_token');
      localStorage.removeItem('arthub_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Type definitions
export interface Artist {
  _id: string;
  name: string;
  email: string;
  bio?: string;
  profilePicture?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    linkedin?: string;
  };
  specialties?: string[];
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  stats?: {
    totalArtworks?: number;
    totalSales?: number;
    totalLikes?: number;
    averageRating?: number;
  };
}

export interface ArtistProfile {
  _id: string;
  name: string;
  bio: string;
  profilePicture?: string;
  location: string;
  website?: string;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    linkedin?: string;
  };
  specialties: string[];
  isVerified: boolean;
  stats: {
    totalArtworks: number;
    totalSales: number;
    totalLikes: number;
    averageRating: number;
  };
}

export interface ArtistResponse {
  success: boolean;
  data: Artist;
  message?: string;
}

export interface ArtistsResponse {
  success: boolean;
  data: Artist[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Artist API functions
export const artistAPI = {
  // Get artist profile
  getProfile: async (): Promise<ArtistResponse> => {
    try {
      const response = await artistClient.get('/artists/profile');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching artist profile:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch artist profile');
    }
  },

  // Create or update artist profile
  createOrUpdateProfile: async (profileData: Partial<ArtistProfile>): Promise<ArtistResponse> => {
    try {
      const response = await artistClient.post('/artists/profile', profileData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating/updating artist profile:', error);
      throw new Error(error.response?.data?.message || 'Failed to create/update artist profile');
    }
  },

  // Get artist by ID
  getArtist: async (artistId: string): Promise<ArtistResponse> => {
    try {
      const response = await artistClient.get(`/artists/${artistId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching artist:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch artist');
    }
  },

  // Search artists
  searchArtists: async (query: string, filters: any = {}): Promise<ArtistsResponse> => {
    try {
      const params = new URLSearchParams({ q: query, ...filters });
      const response = await artistClient.get(`/artists/search?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      console.error('Error searching artists:', error);
      throw new Error(error.response?.data?.message || 'Failed to search artists');
    }
  },

  // Get featured artists
  getFeaturedArtists: async (limit: number = 6): Promise<ArtistsResponse> => {
    try {
      const response = await artistClient.get(`/artists/featured?limit=${limit}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching featured artists:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch featured artists');
    }
  },

  // Follow/Unfollow artist
  toggleFollow: async (artistId: string): Promise<{ success: boolean; data: any }> => {
    try {
      const response = await artistClient.post(`/artists/${artistId}/follow`);
      return response.data;
    } catch (error: any) {
      console.error('Error toggling follow:', error);
      throw new Error(error.response?.data?.message || 'Failed to toggle follow');
    }
  },

  // Get artist stats
  getStats: async (): Promise<{ success: boolean; data: any }> => {
    try {
      const response = await artistClient.get('/artists/stats');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching artist stats:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch artist stats');
    }
  }
};

// Form validation helpers
export const artistValidation = {
  validateName: (name: string): { isValid: boolean; message?: string } => {
    if (!name.trim()) {
      return { isValid: false, message: 'Name is required' };
    }
    if (name.trim().length < 2) {
      return { isValid: false, message: 'Name must be at least 2 characters long' };
    }
    if (name.trim().length > 50) {
      return { isValid: false, message: 'Name must be less than 50 characters' };
    }
    return { isValid: true };
  },

  validateBio: (bio: string): { isValid: boolean; message?: string } => {
    if (!bio.trim()) {
      return { isValid: false, message: 'Bio is required' };
    }
    if (bio.trim().length < 10) {
      return { isValid: false, message: 'Bio must be at least 10 characters long' };
    }
    if (bio.trim().length > 500) {
      return { isValid: false, message: 'Bio must be less than 500 characters' };
    }
    return { isValid: true };
  },

  validateLocation: (location: string): { isValid: boolean; message?: string } => {
    if (!location.trim()) {
      return { isValid: false, message: 'Location is required' };
    }
    if (location.trim().length < 2) {
      return { isValid: false, message: 'Location must be at least 2 characters long' };
    }
    return { isValid: true };
  },

  validateWebsite: (website: string): { isValid: boolean; message?: string } => {
    if (website && website.trim()) {
      const urlPattern = /^https?:\/\/.+/;
      if (!urlPattern.test(website)) {
        return { isValid: false, message: 'Website must be a valid URL starting with http:// or https://' };
      }
    }
    return { isValid: true };
  },

  validateSocialLink: (platform: string, link: string): { isValid: boolean; message?: string } => {
    if (link && link.trim()) {
      const urlPattern = /^https?:\/\/.+/;
      if (!urlPattern.test(link)) {
        return { isValid: false, message: `${platform} link must be a valid URL` };
      }
    }
    return { isValid: true };
  }
};

export default artistAPI;
