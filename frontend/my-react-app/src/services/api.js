// Centralized API base URL — strips trailing slashes to prevent double-slash issues
const raw = import.meta.env.VITE_API_BASE_URL || '';
export const API_BASE_URL = raw.replace(/\/+$/, '');
