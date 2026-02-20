import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/components/Row.css";
import "@/components/Nav.css";

import Nav from "@/components/Nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Netflix Clone Team5",
  description: "Netflix clone project built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Nav />         
        {children}
      </body>
    </html>
  );
}
