import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import SupabaseProvider from "@/providers/SupabaseProvider";
import UserProvider from "@/providers/UserProvider";
import ModalProvider from "@/providers/ModalProvider";

const font = Figtree({
  subsets: ["latin"],
  weight: "700",
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
        <SupabaseProvider>
          <UserProvider>
            <ModalProvider />
            <Sidebar>{children} </Sidebar>
          </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
