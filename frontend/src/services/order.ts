// ============================================
// src/services/order.ts
// ============================================
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/v1';

// Create axios instance for order API
const orderClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
orderClient.interceptors.request.use(
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
orderClient.interceptors.response.use(
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
export interface Order {
  _id: string;
  artwork: {
    _id: string;
    title: string;
    price: number;
    images: Array<{ url: string; isPrimary: boolean }>;
    artist: {
      _id: string;
      name: string;
    };
  };
  buyer: {
    _id: string;
    name: string;
    email: string;
  };
  seller: {
    _id: string;
    name: string;
    email: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  shippingCost: number;
  tax: number;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderResponse {
  success: boolean;
  data: Order;
  message?: string;
}

export interface OrdersResponse {
  success: boolean;
  data: Order[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CreateOrderData {
  artworkId: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  notes?: string;
}

// Order API functions
export const orderAPI = {
  // Create new order
  createOrder: async (orderData: CreateOrderData): Promise<OrderResponse> => {
    try {
      const response = await orderClient.post('/orders', orderData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating order:', error);
      throw new Error(error.response?.data?.message || 'Failed to create order');
    }
  },

  // Get order by ID
  getOrder: async (orderId: string): Promise<OrderResponse> => {
    try {
      const response = await orderClient.get(`/orders/${orderId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching order:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch order');
    }
  },

  // Get user's orders
  getUserOrders: async (page: number = 1, limit: number = 10): Promise<OrdersResponse> => {
    try {
      const response = await orderClient.get(`/orders/user?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching user orders:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch user orders');
    }
  },

  // Get seller's orders
  getSellerOrders: async (page: number = 1, limit: number = 10): Promise<OrdersResponse> => {
    try {
      const response = await orderClient.get(`/orders/seller?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching seller orders:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch seller orders');
    }
  },

  // Update order status
  updateOrderStatus: async (orderId: string, status: Order['status'], trackingNumber?: string): Promise<OrderResponse> => {
    try {
      const response = await orderClient.put(`/orders/${orderId}/status`, { status, trackingNumber });
      return response.data;
    } catch (error: any) {
      console.error('Error updating order status:', error);
      throw new Error(error.response?.data?.message || 'Failed to update order status');
    }
  },

  // Cancel order
  cancelOrder: async (orderId: string, reason?: string): Promise<OrderResponse> => {
    try {
      const response = await orderClient.put(`/orders/${orderId}/cancel`, { reason });
      return response.data;
    } catch (error: any) {
      console.error('Error cancelling order:', error);
      throw new Error(error.response?.data?.message || 'Failed to cancel order');
    }
  },

  // Get order statistics
  getOrderStats: async (): Promise<{ success: boolean; data: any }> => {
    try {
      const response = await orderClient.get('/orders/stats');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching order stats:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch order stats');
    }
  }
};

// Form validation helpers
export const orderValidation = {
  validateShippingAddress: (address: CreateOrderData['shippingAddress']): { isValid: boolean; message?: string } => {
    if (!address.street.trim()) {
      return { isValid: false, message: 'Street address is required' };
    }
    if (!address.city.trim()) {
      return { isValid: false, message: 'City is required' };
    }
    if (!address.state.trim()) {
      return { isValid: false, message: 'State is required' };
    }
    if (!address.zipCode.trim()) {
      return { isValid: false, message: 'ZIP code is required' };
    }
    if (!address.country.trim()) {
      return { isValid: false, message: 'Country is required' };
    }
    return { isValid: true };
  },

  validatePaymentMethod: (method: string): { isValid: boolean; message?: string } => {
    if (!method.trim()) {
      return { isValid: false, message: 'Payment method is required' };
    }
    const validMethods = ['credit_card', 'debit_card', 'paypal', 'stripe', 'bank_transfer'];
    if (!validMethods.includes(method)) {
      return { isValid: false, message: 'Invalid payment method' };
    }
    return { isValid: true };
  },

  validateZipCode: (zipCode: string): { isValid: boolean; message?: string } => {
    if (!zipCode.trim()) {
      return { isValid: false, message: 'ZIP code is required' };
    }
    const zipPattern = /^\d{5}(-\d{4})?$/;
    if (!zipPattern.test(zipCode)) {
      return { isValid: false, message: 'ZIP code must be in format 12345 or 12345-6789' };
    }
    return { isValid: true };
  }
};

export default orderAPI;
