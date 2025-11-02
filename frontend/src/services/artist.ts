// ============================================
// src/services/artist.ts
// ============================================
import { artistAPI as apiArtistAPI, apiClient } from './api.service';

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

// Re-export artistAPI from api.service.ts to maintain compatibility
export const artistAPI = apiArtistAPI;

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
