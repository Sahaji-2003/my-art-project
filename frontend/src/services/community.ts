// ============================================
// src/services/community.ts
// ============================================
import { communityAPI as apiCommunityAPI, apiClient } from './api.service';

// Type definitions
export interface Post {
  _id: string;
  title: string;
  content: string;
  category?: string;
  author: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
  images?: string[];
  likes: number | string[];
  comments: number | any[];
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
  postId: string;
  likes: number;
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityResponse {
  success: boolean;
  data: Post[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface PostResponse {
  success: boolean;
  data: Post;
  message?: string;
}

export interface CommentResponse {
  success: boolean;
  data: Comment[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Re-export communityAPI from api.service.ts and extend with additional methods if needed
export const communityAPI = {
  ...apiCommunityAPI,
  
  // Get all posts with enhanced error handling
  getPosts: async (page: number = 1, limit: number = 10, searchQuery: string = ''): Promise<CommunityResponse> => {
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());
    if (searchQuery) {
      queryParams.append('q', searchQuery);
    }
    const response = await apiClient.get(`/community/posts?${queryParams.toString()}`);
    return response.data;
  },

  // Get comments for post
  getComments: async (postId: string, page: number = 1, limit: number = 10): Promise<CommentResponse> => {
    const response = await apiClient.get(`/community/posts/${postId}/comments?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Add comment to post
  addComment: async (postId: string, content: string): Promise<{ success: boolean; data: Comment }> => {
    const response = await apiClient.post(`/community/posts/${postId}/comments`, { content });
    return response.data;
  },

  // Like/Unlike comment
  toggleCommentLike: async (commentId: string): Promise<{ success: boolean; data: any }> => {
    const response = await apiClient.post(`/community/comments/${commentId}/like`);
    return response.data;
  }
};

// Form validation helpers
export const communityValidation = {
  validatePostTitle: (title: string): { isValid: boolean; message?: string } => {
    if (!title.trim()) {
      return { isValid: false, message: 'Title is required' };
    }
    if (title.trim().length < 5) {
      return { isValid: false, message: 'Title must be at least 5 characters long' };
    }
    if (title.trim().length > 100) {
      return { isValid: false, message: 'Title must be less than 100 characters' };
    }
    return { isValid: true };
  },

  validatePostContent: (content: string): { isValid: boolean; message?: string } => {
    if (!content.trim()) {
      return { isValid: false, message: 'Content is required' };
    }
    if (content.trim().length < 10) {
      return { isValid: false, message: 'Content must be at least 10 characters long' };
    }
    if (content.trim().length > 2000) {
      return { isValid: false, message: 'Content must be less than 2000 characters' };
    }
    return { isValid: true };
  },

  validateComment: (content: string): { isValid: boolean; message?: string } => {
    if (!content.trim()) {
      return { isValid: false, message: 'Comment is required' };
    }
    if (content.trim().length < 1) {
      return { isValid: false, message: 'Comment cannot be empty' };
    }
    if (content.trim().length > 500) {
      return { isValid: false, message: 'Comment must be less than 500 characters' };
    }
    return { isValid: true };
  }
};

export default communityAPI;
