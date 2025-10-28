// ============================================
// src/services/community.ts
// ============================================
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/v1';

// Create axios instance for community API
const communityClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
communityClient.interceptors.request.use(
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
communityClient.interceptors.response.use(
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
export interface Post {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
  images?: string[];
  likes: number;
  comments: number;
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

// Community API functions
export const communityAPI = {
  // Get all posts
  getPosts: async (page: number = 1, limit: number = 10): Promise<CommunityResponse> => {
    try {
      const response = await communityClient.get(`/community/posts?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching posts:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch posts');
    }
  },

  // Get single post
  getPost: async (postId: string): Promise<PostResponse> => {
    try {
      const response = await communityClient.get(`/community/posts/${postId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching post:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch post');
    }
  },

  // Create new post
  createPost: async (postData: { title: string; content: string; images?: string[] }): Promise<PostResponse> => {
    try {
      const response = await communityClient.post('/community/posts', postData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating post:', error);
      throw new Error(error.response?.data?.message || 'Failed to create post');
    }
  },

  // Update post
  updatePost: async (postId: string, postData: { title?: string; content?: string; images?: string[] }): Promise<PostResponse> => {
    try {
      const response = await communityClient.put(`/community/posts/${postId}`, postData);
      return response.data;
    } catch (error: any) {
      console.error('Error updating post:', error);
      throw new Error(error.response?.data?.message || 'Failed to update post');
    }
  },

  // Delete post
  deletePost: async (postId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await communityClient.delete(`/community/posts/${postId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting post:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete post');
    }
  },

  // Like/Unlike post
  toggleLike: async (postId: string): Promise<{ success: boolean; data: any }> => {
    try {
      const response = await communityClient.post(`/community/posts/${postId}/like`);
      return response.data;
    } catch (error: any) {
      console.error('Error toggling like:', error);
      throw new Error(error.response?.data?.message || 'Failed to toggle like');
    }
  },

  // Get comments for post
  getComments: async (postId: string, page: number = 1, limit: number = 10): Promise<CommentResponse> => {
    try {
      const response = await communityClient.get(`/community/posts/${postId}/comments?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching comments:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch comments');
    }
  },

  // Add comment to post
  addComment: async (postId: string, content: string): Promise<{ success: boolean; data: Comment }> => {
    try {
      const response = await communityClient.post(`/community/posts/${postId}/comments`, { content });
      return response.data;
    } catch (error: any) {
      console.error('Error adding comment:', error);
      throw new Error(error.response?.data?.message || 'Failed to add comment');
    }
  },

  // Like/Unlike comment
  toggleCommentLike: async (commentId: string): Promise<{ success: boolean; data: any }> => {
    try {
      const response = await communityClient.post(`/community/comments/${commentId}/like`);
      return response.data;
    } catch (error: any) {
      console.error('Error toggling comment like:', error);
      throw new Error(error.response?.data?.message || 'Failed to toggle comment like');
    }
  },

  // Delete comment
  deleteComment: async (commentId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await communityClient.delete(`/community/comments/${commentId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting comment:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete comment');
    }
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
