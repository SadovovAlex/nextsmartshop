import Container from "@/components/Container";
import Link from "next/link";
import React from "react";
import Image from "next/image"; 
import Menu from "@/components/Menu"; 
import Head from "next/head";

const NotFoundPage = () => {
  return (
    <Container className="flex items-center justify-center py-20 bg-gray-100">
      <Head>
        <title>404 - Страница не найдена</title>
        <meta name="description" content="Страница не найдена. Вернитесь на главную." />
      </Head>
      <div className="max-w-2xl min-h-[400px] flex flex-col items-center justify-center gap-y-5 bg-white shadow-lg rounded-lg p-8">
<Menu/>
        <h2 className="text-4xl font-bold text-red-600">Страница не найдена</h2>
        
        <Image
          src="/static/404.webp"
          alt="404 Not Found"
          className="w-full max-w-xs h-auto my-4" // Адаптивный размер изображения
          width={500} // Укажите ширину изображения
          height={300} // Укажите высоту изображения
        />
       
      </div>
    </Container>
  );
};

export default NotFoundPage;
