import Container from "@/components/Container";
import Link from "next/link";
import React from "react";

const NotFoundPage = () => {
  return (
    <Container className="flex items-center justify-center py-20 bg-gray-100">
      <div className="max-w-2xl min-h-[400px] flex flex-col items-center justify-center gap-y-5 bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-4xl font-bold text-red-600">Страница не найдена</h2>
        
        <img
          src="/static/404.png" // Путь к изображению 404 (добавьте свое изображение)
          alt="404 Not Found"
          className="w-1/2 h-auto my-4"
        />
        <Link
          href={"/"}
          className="bg-black text-slate-100 w-44 h-12 rounded-full text-base font-semibold flex items-center justify-center hover:bg-orange-600 hover:text-white duration-200"
        >
          На главную
        </Link>
      </div>
    </Container>
  );
};

export default NotFoundPage;
