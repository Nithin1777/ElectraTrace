import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

export const fetchProjects = async () => (await api.get("/projects")).data;
export const fetchProjectById = async (projectId) =>
  (await api.get(`/projects/${projectId}`)).data;
export const fetchBomsByProject = async (projectId) =>
  (await api.get(`/boms/project/${projectId}`)).data;
export const fetchBomItemsByBom = async (bomId) =>
  (await api.get(`/bom-items/bom/${bomId}`)).data;
export const createBomItem = async (payload) =>
  (await api.post("/bom-items", payload)).data;
export const deleteBomItem = async (id) =>
  (await api.delete(`/bom-items/${id}`)).data;
export const fetchComponents = async (params = {}) =>
  (await api.get("/components", { params })).data;
export const fetchListingsByComponent = async (compId) =>
  (await api.get(`/listings/component/${compId}`)).data;
export const fetchFootprints = async () => (await api.get("/footprints")).data;

export default api;
