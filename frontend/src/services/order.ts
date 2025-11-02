// ============================================
// src/services/order.ts
// ============================================
import { orderAPI as apiOrderAPI, apiClient } from './api.service';

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

// Re-export orderAPI from api.service.ts and extend with additional methods
export const orderAPI = {
  ...apiOrderAPI,
  
  // Override createOrder to maintain compatibility - accepts artworkId and orderData separately
  createOrder: async (artworkId: string, orderData: CreateOrderData): Promise<OrderResponse> => {
    const response = await apiClient.post(`/orders/${artworkId}/purchase`, orderData);
    return response.data;
  },
  
  // Get user's orders with pagination
  getUserOrders: async (page: number = 1, limit: number = 10): Promise<OrdersResponse> => {
    const response = await apiClient.get(`/orders/my-orders?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get seller's orders (alias for getArtistOrders)
  getSellerOrders: async (page: number = 1, limit: number = 10): Promise<OrdersResponse> => {
    const response = await apiClient.get(`/orders/artist-orders?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Cancel order
  cancelOrder: async (orderId: string, reason?: string): Promise<OrderResponse> => {
    const response = await apiClient.put(`/orders/${orderId}/cancel`, { reason });
    return response.data;
  },

  // Get order statistics
  getOrderStats: async (): Promise<{ success: boolean; data: any }> => {
    const response = await apiClient.get('/orders/stats');
    return response.data;
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
