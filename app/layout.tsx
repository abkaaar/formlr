import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "./components/ui/sonner";
import { baseUrl, siteName } from "./utils/const";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: siteName,
    template: `%s - ${siteName}`,
  },
  metadataBase: new URL(baseUrl),
  description: "A form site!!",
  openGraph: {
    type: "website",
    siteName,
    locale: "en_US",
    images: [
      "/favicon.png",
    ],
  },
  twitter: {
    card: "summary",
    images: [
      "/favicon.png",
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#ea580c",
  colorScheme: "dark light",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
