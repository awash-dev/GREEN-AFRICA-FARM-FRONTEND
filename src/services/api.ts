import axios from "axios";

const isLocal = window.location.hostname === "localhost";
const API_URL = isLocal
  ? "http://localhost:3000/api/products"
  : "https://green-africa-farm-backend.vercel.app/api/products";

export interface Product {
  id?: string | number;
  name: string;
  description_am?: string;
  description_om?: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image_base64?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductInput {
  name: string;
  description: string;
  description_am?: string;
  description_om?: string;
  price: number;
  stock: number;
  category: string;
  image_base64: string;
}

export interface ProductStats {
  total: number;
  lowStock: number;
  outOfStock: number;
  totalValue: number;
}

export const api = {
  getAllProducts: async (params?: any) => {
    const response = await axios.get(API_URL, { params });
    return response.data;
  },

  getProductById: async (id: string | number) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
  },

  getProductStats: async () => {
    const response = await axios.get(`${API_URL}/stats`);
    return response.data;
  },

  createProduct: async (product: ProductInput) => {
    const response = await axios.post(API_URL, product);
    return response.data;
  },

  updateProduct: async (
    id: string | number,
    product: Partial<ProductInput>
  ) => {
    const response = await axios.put(`${API_URL}/${id}`, product);
    return response.data;
  },

  deleteProduct: async (id: string | number) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  },
};
