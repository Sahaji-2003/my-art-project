// ============================================
// src/services/artwork.ts
// ============================================
import { artworkAPI as apiArtworkAPI, apiClient } from './api.service';

// Type definitions matching backend Artwork.js model
export interface Artwork {
  _id: string;
  artistId: string;
  title: string;
  description: string;
  price: number;
  medium: 'Oil on Canvas' | 'Acrylic' | 'Watercolor' | 'Digital Art' | 'Sculpture' | 'Photography' | 'Mixed Media' | 'Pencil' | 'Charcoal' | 'Other';
  style: 'Abstract' | 'Impressionism' | 'Realism' | 'Surrealism' | 'Contemporary' | 'Modern' | 'Pop Art' | 'Minimalism' | 'Expressionism' | 'Other';
  images: Array<{ 
    url: string; 
    isPrimary: boolean; 
  }>;
  dimensions?: {
    width?: number;
    height?: number;
    depth?: number;
    unit?: 'cm' | 'inch' | 'mm' | 'm';
  };
  status?: 'available' | 'sold' | 'reserved' | 'unavailable';
  tags?: string[];
  views?: number;
  likes?: string[]; // Array of user IDs who liked the artwork
  createdAt?: string;
  updatedAt?: string;
  // Populated fields
  artist?: {
    _id: string;
    name: string;
    email: string;
    profilePicture?: string;
  };
  // Computed fields
  isLiked?: boolean;
  likesCount?: number;
}

export interface SearchFilters {
  q?: string;
  medium?: string;
  style?: string;
  price_min?: number;
  price_max?: number;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface CreateArtworkData {
  title: string;
  description: string;
  price: number;
  medium: 'Oil on Canvas' | 'Acrylic' | 'Watercolor' | 'Digital Art' | 'Sculpture' | 'Photography' | 'Mixed Media' | 'Pencil' | 'Charcoal' | 'Other';
  style: 'Abstract' | 'Impressionism' | 'Realism' | 'Surrealism' | 'Contemporary' | 'Modern' | 'Pop Art' | 'Minimalism' | 'Expressionism' | 'Other';
  images: Array<{ 
    url: string; 
    isPrimary: boolean; 
  }>;
  dimensions?: {
    width?: number;
    height?: number;
    depth?: number;
    unit?: 'cm' | 'inch' | 'mm' | 'm';
  };
  tags?: string[];
  status?: 'available' | 'sold' | 'reserved' | 'unavailable';
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface SearchResponse {
  success: boolean;
  data: Artwork[];
  pagination: PaginationInfo;
}

export interface ArtworkResponse {
  success: boolean;
  data: Artwork;
  message?: string;
}

export interface UploadResponse {
  success: boolean;
  data: {
    url: string;
    filename: string;
    size: number;
  };
  message?: string;
}

// Extend api.service artworkAPI with additional methods
export const artworkAPI = {
  ...apiArtworkAPI,
  
  // Search artworks with enhanced error handling
  searchArtworks: async (filters: SearchFilters = {}): Promise<SearchResponse> => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        queryParams.append(key, String(value));
      }
    });
    const response = await apiClient.get(`/artworks/search?${queryParams.toString()}`);
    return response.data;
  },

  // Get artworks by artist
  getArtworksByArtist: async (artistId: string, filters: SearchFilters = {}): Promise<SearchResponse> => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        queryParams.append(key, String(value));
      }
    });
    const url = `/artworks/artists/${artistId}/artworks${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiClient.get(url);
    return response.data;
  },

  // Get trending artworks
  getTrendingArtworks: async (limit: number = 8): Promise<{ success: boolean; data: Artwork[] }> => {
    const response = await apiClient.get(`/artworks/trending?limit=${limit}`);
    return response.data;
  }
};

// Form validation helpers matching backend model validation
export const artworkValidation = {
  validateTitle: (title: string): { isValid: boolean; message?: string } => {
    if (!title.trim()) {
      return { isValid: false, message: 'Artwork title is required' };
    }
    if (title.trim().length < 3) {
      return { isValid: false, message: 'Title must be at least 3 characters long' };
    }
    if (title.trim().length > 200) {
      return { isValid: false, message: 'Title cannot exceed 200 characters' };
    }
    return { isValid: true };
  },

  validateDescription: (description: string): { isValid: boolean; message?: string } => {
    if (!description.trim()) {
      return { isValid: false, message: 'Artwork description is required' };
    }
    if (description.trim().length < 10) {
      return { isValid: false, message: 'Description must be at least 10 characters long' };
    }
    if (description.trim().length > 2000) {
      return { isValid: false, message: 'Description cannot exceed 2000 characters' };
    }
    return { isValid: true };
  },

  validatePrice: (price: number): { isValid: boolean; message?: string } => {
    if (price === undefined || price === null) {
      return { isValid: false, message: 'Price is required' };
    }
    if (price < 0) {
      return { isValid: false, message: 'Price cannot be negative' };
    }
    if (price > 1000000) {
      return { isValid: false, message: 'Price must be less than $1,000,000' };
    }
    return { isValid: true };
  },

  validateMedium: (medium: string): { isValid: boolean; message?: string } => {
    if (!medium.trim()) {
      return { isValid: false, message: 'Medium is required' };
    }
    const validMediums = ['Oil on Canvas', 'Acrylic', 'Watercolor', 'Digital Art', 'Sculpture', 'Photography', 'Mixed Media', 'Pencil', 'Charcoal', 'Other'];
    if (!validMediums.includes(medium)) {
      return { isValid: false, message: 'Please select a valid medium' };
    }
    return { isValid: true };
  },

  validateStyle: (style: string): { isValid: boolean; message?: string } => {
    if (!style.trim()) {
      return { isValid: false, message: 'Style is required' };
    }
    const validStyles = ['Abstract', 'Impressionism', 'Realism', 'Surrealism', 'Contemporary', 'Modern', 'Pop Art', 'Minimalism', 'Expressionism', 'Other'];
    if (!validStyles.includes(style)) {
      return { isValid: false, message: 'Please select a valid style' };
    }
    return { isValid: true };
  },

  validateImages: (images: File[]): { isValid: boolean; message?: string } => {
    if (!images || images.length === 0) {
      return { isValid: false, message: 'At least one image is required' };
    }
    if (images.length > 10) {
      return { isValid: false, message: 'Maximum 10 images allowed' };
    }
    
    for (const file of images) {
      if (!file.type.startsWith('image/')) {
        return { isValid: false, message: 'All files must be images' };
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB
        return { isValid: false, message: 'Each image must be less than 10MB' };
      }
    }
    
    return { isValid: true };
  },

  validateDimensions: (dimensions: { width?: number; height?: number; depth?: number; unit?: string }): { isValid: boolean; message?: string } => {
    if (dimensions.width !== undefined && dimensions.width < 0) {
      return { isValid: false, message: 'Width cannot be negative' };
    }
    if (dimensions.height !== undefined && dimensions.height < 0) {
      return { isValid: false, message: 'Height cannot be negative' };
    }
    if (dimensions.depth !== undefined && dimensions.depth < 0) {
      return { isValid: false, message: 'Depth cannot be negative' };
    }
    if (dimensions.unit && !['cm', 'inch', 'mm', 'm'].includes(dimensions.unit)) {
      return { isValid: false, message: 'Unit must be cm, inch, mm, or m' };
    }
    return { isValid: true };
  },

  validateTags: (tags: string[]): { isValid: boolean; message?: string } => {
    if (tags && tags.length > 20) {
      return { isValid: false, message: 'Maximum 20 tags allowed' };
    }
    for (const tag of tags || []) {
      if (tag.length > 50) {
        return { isValid: false, message: 'Each tag must be less than 50 characters' };
      }
    }
    return { isValid: true };
  }
};

export default artworkAPI;
