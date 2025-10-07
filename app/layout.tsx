import "@/app/global.scss";
import { AnimatePresence } from "framer-motion";

import type { Metadata, Viewport } from "next";

import Template from "@/app/template";
import ClientProviders from "@/components/ClientProviders";
import AppFooter from "@/components/layouts/AppFooter";
import AppHeader from "@/components/layouts/AppHeader";
import { SoundProvider } from "@/components/SoundProvider";
import ThemeProvider from "@/components/ThemeProvider";
import { getCurrentUser } from "@/lib/getCurrentUser";

const title = "Ludaria - Alexis Gousseau";
const description =
  "Website presenting Alexis Gousseau’s profile as a full-stack web developer and database designer.";
const url = "https://alexis-gousseau.com";
const image = "/images/preview-project.png";

export const metadata: Metadata = {
  metadataBase: new URL("https://alexis-gousseau.com"),
  title: title,
  description: description,
  keywords: ["alexis", "gousseau", "ludaria", "puzzle", "games", "nextjs"],
  authors: [{ name: "Alexis Gousseau", url: url }],
  openGraph: {
    title: title,
    description: description,
    url: url,
    siteName: title,
    images: [
      {
        url: image,
        width: 1920,
        height: 1080,
        alt: "Ludaria of Alexis Gousseau",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: title,
    description: description,
    images: [image],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon-57x57.png", sizes: "57x57" },
      { url: "/apple-icon-60x60.png", sizes: "60x60" },
      { url: "/apple-icon-72x72.png", sizes: "72x72" },
      { url: "/apple-icon-76x76.png", sizes: "76x76" },
      { url: "/apple-icon-114x114.png", sizes: "114x114" },
      { url: "/apple-icon-120x120.png", sizes: "120x120" },
      { url: "/apple-icon-144x144.png", sizes: "144x144" },
      { url: "/apple-icon-152x152.png", sizes: "152x152" },
      { url: "/apple-icon-180x180.png", sizes: "180x180" },
    ],
    other: [
      {
        rel: "android-icon",
        url: "/android-icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  },
  manifest: "/manifest.json",
  other: {
    "msapplication-TileColor": "#6344F5",
    "msapplication-TileImage": "/ms-icon-144x144.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#6344F5",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: RootLayoutProps) {
  const user = await getCurrentUser();
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <SoundProvider>
            <ClientProviders initialUser={user}>
              <AnimatePresence mode="wait">
                <div className="min-h-screen">
                  <AppHeader />
                  <Template>{children}</Template>
                  <AppFooter />
                </div>
              </AnimatePresence>
            </ClientProviders>
          </SoundProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
