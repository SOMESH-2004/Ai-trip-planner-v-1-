import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "../_components/ConvexClientProvider";
import type React from "react";



const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "AI Trip Planner",
  description: "An AI-powered trip planning solution built with Next.js and Convex.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ConvexClientProvider >
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
