import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const font = Figtree({
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Spotify Clone",
  description: "Music",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${font.className} antialiased`}>
        <Sidebar>{children} </Sidebar>
      </body>
    </html>
  );
}
