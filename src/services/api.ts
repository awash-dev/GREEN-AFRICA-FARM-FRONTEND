import axios from "axios";

// ─── Base URL ─────────────────────────────────────────────────────────────────
const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000/api"
    : "https://green-africa-farm-backend.vercel.app/api";

// const PRODUCTS_URL = `${BASE_URL}/products`;
// const TEAM_URL = `${BASE_URL}/team`;

// ─── Axios instance with sane defaults ───────────────────────────────────────
const client = axios.create({
  baseURL: BASE_URL,
  // timeout sec 10 s
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Normalise every response so callers always get { success, data }
function normalise(raw: any): { success: boolean; data: any } {
  if (raw === null || raw === undefined) return { success: false, data: [] };
  if (raw.success !== undefined) return raw;               // already wrapped
  if (Array.isArray(raw)) return { success: true, data: raw }; // bare array
  return { success: true, data: raw };
}

// ─── Types ────────────────────────────────────────────────────────────────────
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

// ─── API ──────────────────────────────────────────────────────────────────────
export const api = {
  // ── Products ──────────────────────────────────────────────────────────────
  getAllProducts: async (params?: Record<string, any>) => {
    const res = await client.get("/products", { params });
    return normalise(res.data);
  },
  getProductById: async (id: string | number) => {
    const res = await client.get(`/products/${id}`);
    return normalise(res.data);
  },
  createProduct: async (product: ProductInput | FormData) => {
    const isForm = product instanceof FormData;
    const res = await client.post("/products", product, {
      headers: isForm ? { "Content-Type": "multipart/form-data" } : {},
    });
    return normalise(res.data);
  },
  updateProduct: async (id: string | number, product: Partial<ProductInput> | FormData) => {
    const isForm = product instanceof FormData;
    const res = await client.put(`/products/${id}`, product, {
      headers: isForm ? { "Content-Type": "multipart/form-data" } : {},
    });
    return normalise(res.data);
  },
  deleteProduct: async (id: string | number) => {
    const res = await client.delete(`/products/${id}`);
    return normalise(res.data);
  },

  // ── Categories ────────────────────────────────────────────────────────────
  getCategories: async () => {
    const res = await client.get("/products/categories");
    return normalise(res.data);
  },

  // ── Team ──────────────────────────────────────────────────────────────────
  getTeamMembers: async () => {
    const res = await client.get("/team");
    return normalise(res.data);
  },
  createTeamMember: async (member: Partial<TeamMember>) => {
    const res = await client.post("/team", member);
    return normalise(res.data);
  },
  updateTeamMember: async (id: string, member: Partial<TeamMember>) => {
    const res = await client.put(`/team/${id}`, member);
    return normalise(res.data);
  },
  deleteTeamMember: async (id: string) => {
    const res = await client.delete(`/team/${id}`);
    return normalise(res.data);
  },

  // ── Orders ────────────────────────────────────────────────────────────────
  createOrder: async (orderData: any) => {
    const res = await client.post("/orders", orderData);
    return normalise(res.data);
  },
  getAllOrders: async () => {
    const res = await client.get("/orders");
    return normalise(res.data);
  },
  updateOrderStatus: async (id: string, status: string) => {
    const res = await client.put(`/orders/${id}/status`, { status });
    return normalise(res.data);
  },
};
