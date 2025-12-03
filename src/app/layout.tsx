import React from "react";
import Image from "next/image"; 
import "./css/globals.css";
import type { Metadata } from "next";
import Layout from "@/components/Layout";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from "@/components/Footer";
import Script from "next/script"; // Импортируем Script из next/script

export const metadata: Metadata = {
  metadataBase: new URL("https://ryazantvorog.ru"),
  title: {
    template: "shopping_mart",
    default: "Рязанская молочная ферма Заокское",
  },
  description: "Натуральные молочные продукты от Рязанской молочной фермы Заокское. Свежее молоко, творог, сметана и другие качественные продукты.",
  keywords: "молочная ферма, молочные продукты, натуральное молоко, творог, сметана, рязанская область, заокское",
  authors: [{ name: "Рязанская молочная ферма Заокское" }],
  creator: "Рязанская молочная ферма Заокское",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://ryazantvorog.ru",
    siteName: "Рязанская молочная ферма Заокское",
    title: "Рязанская молочная ферма Заокское - Натуральные молочные продукты",
    description: "Натуральные молочные продукты от Рязанской молочной фермы Заокское. Свежее молоко, творог, сметана и другие качественные продукты.",
    images: [
      {
        url: "/static/logo.webp",
        width: 1200,
        height: 630,
        alt: "Рязанская молочная ферма Заокское",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Рязанская молочная ферма Заокское - Натуральные молочные продукты",
    description: "Натуральные молочные продукты от Рязанской молочной фермы Заокское",
    images: ["/static/logo.webp"],
  },
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
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        {/* Добавляем код Яндекс.Метрики */}
        <Script
          id="yandex-metrica"
          strategy="afterInteractive" // Загружаем скрипт после интерактивности страницы
          dangerouslySetInnerHTML={{
            __html: `
              (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
              (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

              ym(99732927, "init", {
                webvisor:true,
                clickmap:true,
                accurateTrackBounce:true,
                trackLinks:true
              });
            `,
          }}
        />
        {/* Добавляем noscript для пользователей с отключенным JavaScript */}
        <noscript>
  <div style={{ position: "absolute", left: "-9999px" }}>
    <Image
      src="https://mc.yandex.ru/watch/99732927"
      alt="Yandex Metrika"
      width={1} // Минимальная ширина
      height={1} // Минимальная высота
      unoptimized // Отключаем оптимизацию, так как это трекинг-пиксель
    />
  </div>
</noscript>
      </head>
      <body className="font-bodyFont w-full bg-main-bg text-darkText">
        <Layout>
          {children}
        </Layout>
        <Footer />
      </body>
    </html>
  );
}