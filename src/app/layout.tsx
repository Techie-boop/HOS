import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HOS",
  description: "Next-Generation Hackathon Console",
  icons: {
    icon: "https://ik.imagekit.io/dypkhqxip/logo__1_?updatedAt=1781048454786",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="https://ik.imagekit.io/dypkhqxip/logo__1_?updatedAt=1781048454786" />
      </head>
      <body className="min-h-full flex flex-col" id="RS-W26-001">
        {children}
      </body>
    </html>
  );
}
