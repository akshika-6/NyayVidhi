// API configuration - works in both development and production
// In dev: Vite proxy or direct localhost
// In production (Render): same origin, no URL needed
export const API_BASE_URL = import.meta.env.VITE_API_URL || "";
