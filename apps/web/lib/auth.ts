import type { User } from "../types";
const TOKEN_KEY = "ecommerce_token";
const USER_KEY = "ecommerce_user";
export const auth = { getToken: () => typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY), getUser: (): User | null => { if (typeof window === "undefined") return null; const raw = localStorage.getItem(USER_KEY); return raw ? JSON.parse(raw) : null; }, save: (token: string, user: User) => { localStorage.setItem(TOKEN_KEY, token); localStorage.setItem(USER_KEY, JSON.stringify(user)); window.dispatchEvent(new Event("auth-change")); }, clear: () => { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); window.dispatchEvent(new Event("auth-change")); } };
