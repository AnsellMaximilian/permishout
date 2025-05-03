import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import UserContextProvider from "@/context/user/UserContextProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PermiShout",
  description: "Shout only when you’re allowed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <UserContextProvider>
        <html lang="en" suppressHydrationWarning>
          <body
            suppressHydrationWarning
            className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen flex flex-col bg-muted`}
          >
            {children}
            <Toaster />
          </body>
        </html>
      </UserContextProvider>
    </ClerkProvider>
  );
}
