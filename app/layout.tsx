import type { Metadata } from "next";
import { Syne, DM_Mono } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Rodrigo Leites-Mena Portfolio",
  description:
    "Full Stack Developer specializing in React, Next.js, and Node.js. Building scalable web applications with clean code and thoughtful UX.",
  keywords: ["Full Stack Developer", "React", "Next.js", "TypeScript", "Node.js", "Rodrigo Leites-Mena"],
  authors: [{ name: "Rodrigo Leites-Mena" }],
  openGraph: {
    title: "Rodrigo Leites-Mena",
    description: "Full Stack Developer building scalable web applications.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${syne.variable} ${dmMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}