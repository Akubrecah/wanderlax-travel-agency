/* eslint-disable @next/next/no-page-custom-font, @next/next/google-font-display */
import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SocialChatWidget from "./components/SocialChatWidget";

export const metadata: Metadata = {
  title: "Twende Africa Tours | Explore Africa and the World",
  description: "Twende Africa Tours is a professional tour and travel agency providing memorable travel experiences across Africa and international destinations. Reliable, affordable, and exciting travel for individuals, families, and corporate clients.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      signInUrl="/portal/login"
      signUpUrl="/sign-up"
    >
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="flex flex-col min-h-screen" suppressHydrationWarning>
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <SocialChatWidget />
      </body>
    </html>
    </ClerkProvider>
  );
}
