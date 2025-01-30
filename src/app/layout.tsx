import React from "react";
import Image from "next/image"; 
import "./css/globals.css";
import type { Metadata } from "next";
import Layout from "@/components/Layout";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from "@/components/Footer";
import Script from "next/script"; // Импортируем Script из next/script

// export const metadata: Metadata = {
//   title: {
//     template: "shopping_mart",
//     default: "Рязанская молочная ферма Заокское",
//   },
// };

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
                clickmap:true,
                trackLinks:true,
                accurateTrackBounce:true
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
          <Footer />
        </Layout>
      </body>
    </html>
  );
}