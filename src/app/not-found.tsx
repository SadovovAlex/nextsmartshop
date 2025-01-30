import Container from "@/components/Container";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import Menu from "@/components/Menu";

// Определяем метаданные
export const metadata = {
  title: "404 - Страница не найдена",
  description: "Страница не найдена. Вернитесь на главную.",
};

const NotFoundPage = () => {
  return (
    <div>
    <Menu/> 
    <Container>
      <div className="min-h-[500px] flex flex-col items-center justify-center gap-y-5 bg-white shadow-lg rounded-lg p-8">
        
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
    </div> 
  );
};

export default NotFoundPage;