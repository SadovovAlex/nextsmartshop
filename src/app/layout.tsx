// app/layout.tsx - Исправленная версия
import React from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import Image from "next/image";

// ===== ИМПОРТ СТИЛЕЙ (с отключением TypeScript проверки) =====
// @ts-ignore
import "./css/globals.css";
// @ts-ignore
import "slick-carousel/slick/slick.css";
// @ts-ignore
import "slick-carousel/slick/slick-theme.css";

import Layout from "@/components/Layout";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { CONTACT } from "@/constants/text";

// ===== НАСТРОЙКА ШРИФТА =====
const inter = Inter({ 
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
});

// ===== МЕТАДАННЫЕ =====
export const metadata: Metadata = {
  metadataBase: new URL("https://ryazantvorog.ru"),
  title: {
    template: "%s | Рязанская молочная ферма Заокское",
    default: "Рязанская молочная ферма Заокское",
  },
  description: "Натуральные молочные продукты от Рязанской молочной фермы Заокское. Свежее молоко, творог, сметана и другие качественные продукты с доставкой.",
  keywords: [
    "молочная ферма",
    "молочные продукты",
    "натуральное молоко",
    "творог",
    "сметана",
    "рязанская область",
    "заокское",
    "доставка молока",
    "оптом молоко",
    "рязанский творог"
  ].join(", "),
  authors: [{ 
    name: "Рязанская молочная ферма Заокское",
    url: "https://ryazantvorog.ru"
  }],
  creator: "Рязанская молочная ферма Заокское",
  publisher: "Рязанская молочная ферма Заокское",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  
  // ===== OPEN GRAPH =====
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://ryazantvorog.ru",
    siteName: "Рязанская молочная ферма Заокское",
    title: "Рязанская молочная ферма Заокское - Натуральные молочные продукты",
    description: "Натуральные молочные продукты от Рязанской молочной фермы Заокское. Свежее молоко, творог, сметана и другие качественные продукты с доставкой по Москве и области.",
    images: [
      {
        url: "/static/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Рязанская молочная ферма Заокское",
        type: "image/jpeg",
      },
      {
        url: "/static/logo.webp",
        width: 512,
        height: 512,
        alt: "Логотип Рязанской молочной фермы",
        type: "image/webp",
      },
    ],
    emails: [CONTACT.EMAIL],
    phoneNumbers: [CONTACT.PHONE],
  },
  
  // ===== TWITTER =====
  twitter: {
    card: "summary_large_image",
    site: "@ryazantvorog",
    creator: "@ryazantvorog",
    title: "Рязанская молочная ферма Заокское - Натуральные молочные продукты",
    description: "Натуральные молочные продукты от производителя с доставкой по Москве и области.",
    images: ["/static/og-image.jpg"],
  },
  
  // ===== ROBOTS =====
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
    nocache: false,
  },
  
  // ===== VERIFICATION =====
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
  
  // ===== ALTERNATES =====
  alternates: {
    canonical: "https://ryazantvorog.ru",
  },
  
  // ===== ICONS =====
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#f97316",
      },
    ],
  },
  
  // ===== MANIFEST =====
  manifest: "/site.webmanifest",
  
  // ===== OTHER =====
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Рязанская молочная ферма",
  },
  
  applicationName: "Рязанская молочная ферма Заокское",
  
  referrer: "origin-when-cross-origin",
  
  colorScheme: "light",
  
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a2e" },
  ],
};

// ===== VIEWPORT =====
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a2e" },
  ],
};

// ===== ROOT LAYOUT =====
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={inter.variable}>
      <head>
        {/* ===== YANDEX METRIKA ===== */}
        <Script
          id="yandex-metrica"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for(var j=0;j<document.scripts.length;j++){
                  if(document.scripts[j].src===r){return;}
                }
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],
                k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
              })
              (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

              ym(99732927, "init", {
                webvisor: true,
                clickmap: true,
                accurateTrackBounce: true,
                trackLinks: true,
                ut: "noindex"
              });
            `,
          }}
        />
        <noscript>
          <div style={{ position: "absolute", left: "-9999px" }}>
            <Image
              src="https://mc.yandex.ru/watch/99732927"
              alt=""
              width={1}
              height={1}
              unoptimized
            />
          </div>
        </noscript>

        {/* ===== PRELOAD ===== */}
        <link rel="preload" href="/static/logo.webp" as="image" type="image/webp" />
        <link rel="preconnect" href="https://mc.yandex.ru" />
        <link rel="dns-prefetch" href="https://mc.yandex.ru" />
      </head>
      <body className="font-bodyFont w-full bg-main-bg text-darkText antialiased">
        <Layout>
          {children}
        </Layout>
        <Footer />
        
        {/* ===== ГЛОБАЛЬНЫЙ TOASTER ===== */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#363636",
              color: "#fff",
              borderRadius: "12px",
              padding: "16px",
            },
            success: {
              icon: "✅",
              style: {
                background: "#22c55e",
                color: "#fff",
                borderRadius: "12px",
                padding: "16px",
              },
            },
            error: {
              style: {
                background: "#ef4444",
                color: "#fff",
                borderRadius: "12px",
                padding: "16px",
              },
            },
          }}
        />
      </body>
    </html>
  );
}