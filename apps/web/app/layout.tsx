import type { ReactNode } from "react";
import "./globals.css";
import { Navbar } from "../components/navbar";
import { ToastProvider } from "../components/toast";
export default function RootLayout({ children }: { children: ReactNode }) { return <html lang="en"><body><ToastProvider><Navbar/>{children}</ToastProvider></body></html>; }
