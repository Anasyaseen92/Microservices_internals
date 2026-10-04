"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
type Toast = { id: number; message: string; tone: "success" | "error" };
const ToastContext = createContext<(message: string, tone?: Toast["tone"]) => void>(() => {});
export function ToastProvider({ children }: { children: ReactNode }) { const [toasts, setToasts] = useState<Toast[]>([]); const show = (message: string, tone: Toast["tone"] = "success") => { const id = Date.now(); setToasts(v => [...v, { id, message, tone }]); setTimeout(() => setToasts(v => v.filter(t => t.id !== id)), 3500); }; return <ToastContext.Provider value={show}>{children}<div className="fixed right-4 top-20 z-50 space-y-3">{toasts.map(t => <div key={t.id} className={`rounded-xl px-4 py-3 text-sm font-medium text-white shadow-xl ${t.tone === "error" ? "bg-red-600" : "bg-slate-900"}`}>{t.message}</div>)}</div></ToastContext.Provider>; }
export const useToast = () => useContext(ToastContext);
