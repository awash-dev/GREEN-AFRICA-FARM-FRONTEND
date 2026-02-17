import axios from "axios";

// Using dynamic base URL for different environments
const BASE_URL = window.location.hostname === "localhost"
  ? "http://localhost:3000/api"
  : "https://green-africa-farm-backend.vercel.app/api";

const PRODUCTS_URL = `${BASE_URL}/products`;
const TEAM_URL = `${BASE_URL}/team`;

export interface Product {
  id?: string | number;
  name: string;
  category: string;
  description: string;
  description_am?: string;
  description_om?: string;
  price: number;
  image_base64?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductInput {
  name: string;
  category: string;
  description: string;
  description_am?: string;
  description_om?: string;
  price: number;
  image_base64?: string;
}

export interface TeamMember {
  id?: string;
  name: string;
  role: string;
  role_am?: string;
  role_om?: string;
  bio?: string;
  bio_am?: string;
  bio_om?: string;
  image_base64?: string;
  order?: number;
  is_active?: boolean;
}

export const api = {
  // Products Endpoints
  getAllProducts: async (params?: any) => {
    const response = await axios.get(PRODUCTS_URL, { params });
    return response.data;
  },
  getProductById: async (id: string | number) => {
    const response = await axios.get(`${PRODUCTS_URL}/${id}`);
    return response.data;
  },
  createProduct: async (product: any) => {
    const response = await axios.post(PRODUCTS_URL, product);
    return response.data;
  },
  updateProduct: async (id: string | number, product: any) => {
    const response = await axios.put(`${PRODUCTS_URL}/${id}`, product);
    return response.data;
  },
  deleteProduct: async (id: string | number) => {
    const response = await axios.delete(`${PRODUCTS_URL}/${id}`);
    return response.data;
  },

  // Categories
  getCategories: async () => {
    const response = await axios.get(`${PRODUCTS_URL}/categories`);
    return response.data;
  },

  // Team/Founder Endpoints
  getTeamMembers: async () => {
    const response = await axios.get(TEAM_URL);
    return response.data;
  },
  createTeamMember: async (member: Partial<TeamMember>) => {
    const response = await axios.post(TEAM_URL, member);
    return response.data;
  },
  updateTeamMember: async (id: string, member: Partial<TeamMember>) => {
    const response = await axios.put(`${TEAM_URL}/${id}`, member);
    return response.data;
  },
  deleteTeamMember: async (id: string) => {
    const response = await axios.delete(`${TEAM_URL}/${id}`);
    return response.data;
  },

  // Orders
  createOrder: async (orderData: any) => {
    const response = await axios.post(`${BASE_URL}/orders`, orderData);
    return response.data;
  },
  getAllOrders: async () => {
    const response = await axios.get(`${BASE_URL}/orders`);
    return response.data;
  },
  updateOrderStatus: async (id: string, status: string) => {
    const response = await axios.put(`${BASE_URL}/orders/${id}/status`, { status });
    return response.data;
  }
};
